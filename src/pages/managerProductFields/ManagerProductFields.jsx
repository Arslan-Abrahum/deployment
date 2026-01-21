import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, updateCategory, fetchCategories } from '../../store/actions/adminActions';
import { managerService } from '../../services/interceptors/manager.service';
import { toast } from 'react-toastify';
import './ManagerProductFields.css';

const ManagerProductFields = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories: categoriesFromStore } = useSelector((state) => state.admin);

  // Check if we're in edit mode
  const editingCategoryId = localStorage.getItem('editingCategoryId');
  const isEditMode = !!editingCategoryId;

  const [categoryName, setCategoryName] = useState('');

  // Convert validation_schema to fields format
  const convertValidationSchemaToFields = (validationSchema) => {
    if (!validationSchema || typeof validationSchema !== 'object') {
      return [];
    }

    return Object.entries(validationSchema).map(([key, schema], index) => {
      const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const field = {
        id: Date.now() + index,
        name: fieldName,
        type: schema.type === 'string' && schema.enum ? 'select' : schema.type || 'text',
        required: schema.required || false,
        placeholder: '',
        sortOrder: index + 1,
      };

      if (schema.enum && Array.isArray(schema.enum)) {
        field.options = schema.enum;
      }

      return field;
    });
  };

  useEffect(() => {
    // Get category name from localStorage
    const name = localStorage.getItem('pendingCategoryName');
    if (name) {
      setCategoryName(name);
    } else {
      // If no name found, redirect back to category list
      navigate('/admin/category');
      return;
    }

    // If in edit mode, load existing category fields
    if (isEditMode && editingCategoryId) {
      if (categoriesFromStore && Array.isArray(categoriesFromStore)) {
        const category = categoriesFromStore.find(cat => cat.id === parseInt(editingCategoryId));

        if (category && category.validation_schema) {
          const existingFields = convertValidationSchemaToFields(category.validation_schema);
          if (existingFields.length > 0) {
            setFields(existingFields);
          }
        }
      } else {
        // If categories not loaded yet, fetch them
        dispatch(fetchCategories());
      }
    }
  }, [navigate, isEditMode, editingCategoryId, categoriesFromStore, dispatch]);

  // Re-check for category after fetching
  useEffect(() => {
    if (isEditMode && editingCategoryId && categoriesFromStore) {
      const category = Array.isArray(categoriesFromStore) 
        ? categoriesFromStore.find(cat => cat.id === parseInt(editingCategoryId))
        : null;

      if (category && category.validation_schema) {
        const existingFields = convertValidationSchemaToFields(category.validation_schema);
        if (existingFields.length > 0) {
          setFields(existingFields);
        }
      }
    }
  }, [categoriesFromStore, isEditMode, editingCategoryId]);

  // Load existing checklist in edit mode using GET /api/inspections/templates/
  useEffect(() => {
    const loadExistingChecklist = async () => {
      if (isEditMode && editingCategoryId && categoryName) {
        try {
          // Fetch all checklists from GET /api/inspections/templates/
          const checklists = await managerService.getChecklists();
          
          // Match checklist title with category name
          // e.g., "town sub" should match "town sub Inspection"
          const expectedTitle = `${categoryName} Inspection`;
          const matchingChecklist = Array.isArray(checklists) 
            ? checklists.find(cl => {
                // Case-insensitive comparison and handle variations
                const checklistTitle = cl.title?.trim() || '';
                const normalizedChecklistTitle = checklistTitle.toLowerCase();
                const normalizedExpectedTitle = expectedTitle.toLowerCase();
                
                // Exact match or category name matches the beginning of checklist title
                return normalizedChecklistTitle === normalizedExpectedTitle ||
                       normalizedChecklistTitle === `${categoryName.toLowerCase()} inspection` ||
                       checklistTitle.toLowerCase().startsWith(categoryName.toLowerCase());
              })
            : null;
                    
          if (matchingChecklist) {
            setExistingChecklistId(matchingChecklist.id);
            setChecklistDescription(matchingChecklist.description || '');
            
            // Convert template_data to checklist categories format
            if (matchingChecklist.template_data && typeof matchingChecklist.template_data === 'object') {
              const categories = Object.entries(matchingChecklist.template_data).map(([name, items], index) => ({
                id: Date.now() + index,
                name,
                items: Array.isArray(items) ? items.map((item, itemIndex) => ({
                  id: Date.now() + index * 1000 + itemIndex,
                  name: typeof item === 'string' ? item : item.name || String(item)
                })) : []
              }));
              setChecklistCategories(categories);
            } else {
              // If template_data is empty or invalid, start with empty categories
              setChecklistCategories([]);
            }
          } else {
            // No matching checklist found - user will need to create one
            setExistingChecklistId(null);
            setChecklistCategories([]);
            setChecklistDescription('');
          }
        } catch (error) {
          console.error('Failed to load checklist:', error);
          // On error, reset to empty state
          setExistingChecklistId(null);
          setChecklistCategories([]);
          setChecklistDescription('');
        }
      }
    };

    if (categoryName) {
      loadExistingChecklist();
    }
  }, [isEditMode, editingCategoryId, categoryName]);

  const [category, setCategory] = useState({
    id: categoryId,
    name: categoryName || 'New Category',
    icon: '🚗',
    iconColor: '#3B82F6'
  });

  // Initialize fields - empty for edit mode (will be loaded), default for create mode
  const [fields, setFields] = useState(() => {
    // If in edit mode, start with empty array (will be populated from API)
    if (localStorage.getItem('editingCategoryId')) {
      return [];
    }
    // Default fields for new categories
    return [
      { id: 1, name: 'Title', type: 'text', required: true, placeholder: 'e.g., Product Title', sortOrder: 1 },
      { id: 2, name: 'Description', type: 'textarea', required: true, placeholder: 'e.g., Product Description', sortOrder: 2 },
      { id: 3, name: 'Year', type: 'number', required: true, placeholder: 'e.g., 2020', sortOrder: 3 },
    ];
  });

  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: ''
  });

  const [editingField, setEditingField] = useState(null);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [errors, setErrors] = useState({});

  // Checklist state
  const [checklistDescription, setChecklistDescription] = useState('');
  const [checklistCategories, setChecklistCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingChecklistCategoryId, setEditingChecklistCategoryId] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [checklistErrors, setChecklistErrors] = useState({});
  const [existingChecklistId, setExistingChecklistId] = useState(null);

  const fieldTypes = [
    { value: 'text', label: 'Text Field', icon: '📝' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'select', label: 'Dropdown', icon: '📋' },
    { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { value: 'textarea', label: 'Text Area', icon: '📄' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'file', label: 'File Upload', icon: '📎' },
    { value: 'email', label: 'Email', icon: '✉️' },
    { value: 'url', label: 'URL', icon: '🔗' },
    { value: 'color', label: 'Color Picker', icon: '🎨' },
    { value: 'range', label: 'Range Slider', icon: '🎚️' },
    { value: 'tel', label: 'Phone Number', icon: '📞' },
  ];

  const handleNewFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewField(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOptionsKeyDown = (e) => {
    // Handle Enter key to auto-add comma
    if (e.key === 'Enter' && e.target.name === 'options') {
      const textarea = e.target;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const textAfterCursor = textarea.value.substring(cursorPosition);
      
      const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
      const currentLine = lastNewlineIndex === -1 ? textBeforeCursor : textBeforeCursor.substring(lastNewlineIndex + 1);
      
      if (currentLine.trim() && !currentLine.trim().endsWith(',')) {
        e.preventDefault();
        const newValue = textBeforeCursor + ',' + '\n' + textAfterCursor;
        setNewField(prev => ({
          ...prev,
          options: newValue
        }));
        setTimeout(() => {
          textarea.setSelectionRange(cursorPosition + 2, cursorPosition + 2);
        }, 0);
      }
    }
  };

  const validateField = (field) => {
    const newErrors = {};

    if (!field.name.trim()) {
      newErrors.name = 'Field name is required';
    } else if (field.name.length < 2) {
      newErrors.name = 'Field name must be at least 2 characters';
    }

    if (field.type === 'select' && !field.options.trim()) {
      newErrors.options = 'Options are required for dropdown fields';
    }

    return newErrors;
  };

  const handleAddField = () => {
    const errors = validateField(newField);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const fieldData = {
      id: Date.now(),
      name: newField.name,
      type: newField.type,
      required: newField.required,
      placeholder: newField.placeholder,
      sortOrder: fields.length + 1,
      ...(newField.type === 'select' && {
        options: newField.options.split(/[,\n]/).map(opt => opt.trim()).filter(opt => opt)
      })
    };

    setFields(prev => [...prev, fieldData]);
    setNewField({
      name: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: ''
    });
    setShowFieldForm(false);
    setErrors({});
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setNewField({
      name: field.name,
      type: field.type,
      required: field.required,
      placeholder: field.placeholder || '',
      options: field.options ? field.options.join(',\n') : ''
    });
    setShowFieldForm(true);
  };

  const handleUpdateField = () => {
    const errors = validateField(newField);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setFields(prev => prev.map(field =>
      field.id === editingField.id
        ? {
          ...field,
          name: newField.name,
          type: newField.type,
          required: newField.required,
          placeholder: newField.placeholder,
          ...(newField.type === 'select' && {
            options: newField.options.split(/[,\n]/).map(opt => opt.trim()).filter(opt => opt)
          })
        }
        : field
    ));

    setEditingField(null);
    setNewField({
      name: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: ''
    });
    setShowFieldForm(false);
    setErrors({});
  };

  const handleDeleteField = (id) => {
    if (window.confirm('Are you sure you want to delete this field? This will affect all products in this category.')) {
      setFields(prev => prev.filter(field => field.id !== id));
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newIndex) => {
    e.preventDefault();
    const oldIndex = e.dataTransfer.getData('text/plain');

    if (oldIndex !== newIndex) {
      const newFields = [...fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);

      const updatedFields = newFields.map((field, index) => ({
        ...field,
        sortOrder: index + 1
      }));

      setFields(updatedFields);
    }
  };

  const handleSaveFields = async () => {
    if (!categoryName) {
      alert('Category name is missing. Please go back and enter a category name.');
      return;
    }

    // Validate checklist
    const checklistValidationErrors = validateChecklist();
    if (Object.keys(checklistValidationErrors).length > 0) {
      setChecklistErrors(checklistValidationErrors);
      alert('Please complete the checklist creation. Checklist is required.');
      return;
    }

    // Build validation_schema from fields
    const validationSchema = {};
    fields.forEach(field => {
      const fieldSchema = { type: field.type === 'select' ? 'string' : field.type };
      
      if (field.required) {
        fieldSchema.required = true;
      }

      if (field.type === 'select' && field.options && field.options.length > 0) {
        fieldSchema.enum = field.options;
      }

      validationSchema[field.name.toLowerCase().replace(/\s+/g, '_')] = fieldSchema;
    });

    const categoryData = {
      name: categoryName,
      validation_schema: validationSchema
    };

    try {
      let createdCategoryId = null;

      if (isEditMode && editingCategoryId) {
        // Update existing category
        const result = await dispatch(updateCategory({ 
          categoryId: parseInt(editingCategoryId), 
          categoryData 
        })).unwrap();
        createdCategoryId = result?.id || parseInt(editingCategoryId);
      } else {
        // Create new category
        const result = await dispatch(createCategory(categoryData)).unwrap();
        createdCategoryId = result?.id;
      }

      // Create or update checklist
      const checklistTitle = `${categoryName} Inspection`;
      const templateData = {};
      checklistCategories.forEach(category => {
        templateData[category.name] = category.items.map(item => item.name);
      });

      const checklistData = {
        title: checklistTitle,
        description: checklistDescription,
        is_active: true,
        template_data: templateData
      };

      if (isEditMode && existingChecklistId) {
        // Update existing checklist using PUT API
        await managerService.updateChecklist(existingChecklistId, checklistData);
        toast.success('Category and checklist updated successfully!');
      } else {
        // Create new checklist
        await managerService.createChecklist(checklistData);
        toast.success('Category and checklist created successfully!');
      }

      // Clear localStorage
      localStorage.removeItem('pendingCategoryName');
      if (isEditMode) {
        localStorage.removeItem('editingCategoryId');
      }
      
      // Refresh categories list
      dispatch(fetchCategories());
      
      // Navigate back to category list
      navigate('/admin/category');
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} category/checklist:`, error);
      // Don't show duplicate error toast - the action already shows one
      // Only show error if it's a checklist-specific error
      if (error.message && error.message.includes('checklist')) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            `Failed to ${isEditMode ? 'update' : 'create'} checklist. Please try again.`;
        toast.error(errorMessage);
      }
    }
  };

  const getFieldTypeIcon = (type) => {
    const typeInfo = fieldTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.icon : '📝';
  };

  const getFieldTypeLabel = (type) => {
    const typeInfo = fieldTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.label : 'Text Field';
  };

  // Checklist handlers
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setChecklistErrors({ categoryName: 'Category name is required' });
      return;
    }

    if (checklistCategories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setChecklistErrors({ categoryName: 'Category with this name already exists' });
      return;
    }

    setChecklistCategories(prev => [...prev, {
      id: Date.now(),
      name: newCategoryName.trim(),
      items: []
    }]);
    setNewCategoryName('');
    setShowCategoryForm(false);
    setChecklistErrors({});
  };

  const handleEditCategory = (categoryId) => {
    const category = checklistCategories.find(cat => cat.id === categoryId);
    if (category) {
      setEditingChecklistCategoryId(categoryId);
      setNewCategoryName(category.name);
      setShowCategoryForm(true);
    }
  };

  const handleUpdateCategory = () => {
    if (!newCategoryName.trim()) {
      setChecklistErrors({ categoryName: 'Category name is required' });
      return;
    }

    setChecklistCategories(prev => prev.map(cat =>
      cat.id === editingChecklistCategoryId
        ? { ...cat, name: newCategoryName.trim() }
        : cat
    ));
    setEditingChecklistCategoryId(null);
    setNewCategoryName('');
    setShowCategoryForm(false);
    setChecklistErrors({});
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this inspection category? All items in this category will be deleted.')) {
      setChecklistCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleAddChecklistItem = (categoryId, itemName) => {
    if (!itemName.trim()) {
      return;
    }

    setChecklistCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? {
          ...cat,
          items: [...cat.items, {
            id: Date.now(),
            name: itemName.trim()
          }]
        }
        : cat
    ));
  };

  const handleDeleteChecklistItem = (categoryId, itemId) => {
    setChecklistCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        }
        : cat
    ));
  };

  const validateChecklist = () => {
    const newErrors = {};

    if (!checklistDescription.trim()) {
      newErrors.description = 'Checklist description is required';
    }

    if (checklistCategories.length === 0) {
      newErrors.categories = 'At least one inspection category is required';
    } else {
      // Check if all categories have at least one item
      const emptyCategories = checklistCategories.filter(cat => cat.items.length === 0);
      if (emptyCategories.length > 0) {
        newErrors.categories = 'All inspection categories must have at least one checklist item';
      }
    }

    return newErrors;
  };

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="manage-fields-header">
            <div className="category-details">
              <h1 className="manage-field-page-title">Manage Product Fields</h1>
              <p className="manage-field-page-subtitle">
                Configure custom fields for products in <strong>{categoryName || 'New Category'}</strong> category
              </p>
            </div>
            <div className="header-actions">
              <button
                className="field-secondary-btn"
                onClick={() => {
                  // Clear edit mode data when canceling
                  if (isEditMode) {
                    localStorage.removeItem('editingCategoryId');
                    localStorage.removeItem('pendingCategoryName');
                  }
                  navigate('/admin/category');
                }}
              >
                Back to Categories
              </button>
              <button
                className="primary-action-btn field-primary"
                onClick={handleSaveFields}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Save All Changes
              </button>
            </div>
          </div>

          <div className="fields-management-section">
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">Current Fields ({fields.length})</h3>
                <div className="section-description">
                  Drag to reorder fields. Required fields will be marked with asterisk (*) on seller forms.
                </div>
              </div>

              <div className="fields-list">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="field-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="field-drag-handle">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7H20M8 12H20M8 17H20M4 7V7.01M4 12V12.01M4 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="field-icon">
                      <span className="field-type-icon">{getFieldTypeIcon(field.type)}</span>
                    </div>
                    <div className="field-content">
                      <div className="field-header">
                        <h4 className="field-name">
                          {field.name}
                          {field.required && <span className="required-asterisk">*</span>}
                        </h4>
                        <div className="field-meta">
                          <span className="field-type">{getFieldTypeLabel(field.type)}</span>
                          {field.placeholder && (
                            <span className="field-placeholder">Placeholder: {field.placeholder}</span>
                          )}
                        </div>
                      </div>
                      {field.type === 'select' && field.options && (
                        <div className="field-options">
                          <span className="options-label">Options:</span>
                          <div className="options-list">
                            {field.options.map((option, idx) => (
                              <span key={idx} className="option-tag">{option}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="field-actions">
                      <button
                        className="field-action-btn field-edit-btn"
                        onClick={() => handleEditField(field)}
                        title="Edit field"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        className="field-action-btn field-delete-btn"
                        onClick={() => handleDeleteField(field.id)}
                        title="Delete field"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`field-form-section ${showFieldForm ? 'expanded' : ''}`}>
              <div className="section-card">
                <div className="section-header">
                  <h3 className="section-title">
                    {editingField ? 'Edit Field' : 'Add New Field'}
                  </h3>
                  {!showFieldForm && (
                    <button
                      className="add-field-btn"
                      onClick={() => setShowFieldForm(true)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Add New Field
                    </button>
                  )}
                </div>

                {showFieldForm && (
                  <div className="field-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Field Name <span className="required-asterisk">*</span></label>
                        <input
                          type="text"
                          name="name"
                          value={newField.name}
                          onChange={handleNewFieldChange}
                          placeholder="e.g., Model, Serial Number, Condition"
                          className={`form-input ${errors.name ? 'error' : ''}`}
                        />
                        {errors.name && (
                          <span className="error-message">{errors.name}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Field Type <span className="required-asterisk">*</span></label>
                        <div className="field-type-grid">
                          {fieldTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              className={`field-type-item ${newField.type === type.value ? 'selected' : ''
                                }`}
                              onClick={() => setNewField(prev => ({ ...prev, type: type.value }))}
                            >
                              <span className="type-icon">{type.icon}</span>
                              <span className="type-label">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {newField.type === 'select' && (
                      <div className="form-section">
                        <div className="form-group">
                          <label className="form-label required">Dropdown Options</label>
                          <textarea
                            name="options"
                            value={newField.options}
                            onChange={handleNewFieldChange}
                            placeholder="Enter options separated by commas (e.g., New, Used, Refurbished)"
                            className={`form-textarea ${errors.options ? 'error' : ''}`}
                            rows="3"
                          />
                          {errors.options && (
                            <span className="error-message">{errors.options}</span>
                          )}
                          <div className="textarea-info">
                            <span className="hint-text">Options will appear as dropdown choices</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Placeholder Text</label>
                        <input
                          type="text"
                          name="placeholder"
                          value={newField.placeholder}
                          onChange={handleNewFieldChange}
                          placeholder="Optional hint text for the field"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Field Settings</label>
                        <div className="field-settings">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              name="required"
                              checked={newField.required}
                              onChange={handleNewFieldChange}
                              className="checkbox-input"
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Required Field</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="field-secondary-btn"
                        onClick={() => {
                          setShowFieldForm(false);
                          setEditingField(null);
                          setNewField({
                            name: '',
                            type: 'text',
                            required: false,
                            placeholder: '',
                            options: ''
                          });
                          setErrors({});
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="field-primary-btn"
                        onClick={editingField ? handleUpdateField : handleAddField}
                      >
                        {editingField ? 'Update Field' : 'Add Field'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="preview-section">
              <div className="section-card">
                <div className="section-header">
                  <h3 className="section-title">Seller Form Preview</h3>
                  <div className="section-description">
                    How the fields will appear to sellers when adding products
                  </div>
                </div>

                <div className="preview-form">
                  <div className="preview-header">
                    <h4 className="preview-title">Add New Product - {categoryName || 'New Category'}</h4>
                    <p className="preview-subtitle">Required fields are marked with *</p>
                  </div>

                  <div className="preview-fields">
                    {fields.map(field => (
                      <div key={field.id} className="preview-field">
                        <label className="preview-label">
                          {field.name}
                          {field.required && <span className="required-asterisk">*</span>}
                        </label>
                        {field.type === 'text' && (
                          <input
                            type="text"
                            className="preview-input"
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            disabled
                          />
                        )}
                        {field.type === 'number' && (
                          <input
                            type="number"
                            className="preview-input"
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            disabled
                          />
                        )}
                        {field.type === 'select' && (
                          <select className="preview-select">
                            <option value="">Select {field.name.toLowerCase()}</option>
                            {field.options?.map((option, idx) => (
                              <option key={idx} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                        {field.type === 'textarea' && (
                          <textarea
                            className="preview-textarea"
                            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                            rows="3"
                            disabled
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist Creation Section */}
            <div className="checklist-section">
              <div className="section-card">
                <div className="section-header">
                  <h3 className="section-title">Checklist Creation</h3>
                  <div className="section-description">
                    Create inspection checklist for <strong>{categoryName || 'New Category'} Inspection</strong>. This checklist will be shown to managers during inspections.
                  </div>
                </div>

                <div className="checklist-form">
                  <div className="form-group">
                    <label className="form-label">Checklist Description <span className="required-asterisk">*</span></label>
                    <textarea
                      value={checklistDescription}
                      onChange={(e) => {
                        setChecklistDescription(e.target.value);
                        if (checklistErrors.description) {
                          setChecklistErrors(prev => ({ ...prev, description: '' }));
                        }
                      }}
                      placeholder="e.g., Comprehensive inspection checklist for Sedans and SUVs used by Hammer & Tongues."
                      className={`form-textarea ${checklistErrors.description ? 'error' : ''}`}
                      rows="3"
                    />
                    {checklistErrors.description && (
                      <span className="error-message">{checklistErrors.description}</span>
                    )}
                  </div>

                  <div className="checklist-categories-section">
                    <div className="section-header">
                      <h4 className="section-subtitle">Inspection Categories ({checklistCategories.length})</h4>
                      {checklistErrors.categories && (
                        <span className="error-message">{checklistErrors.categories}</span>
                      )}
                    </div>

                    {checklistCategories.length > 0 && (
                      <div className="checklist-categories-list">
                        {checklistCategories.map((category) => (
                          <div key={category.id} className="checklist-category-item">
                            <div className="category-header">
                              <h5 className="category-name">{category.name}</h5>
                              <div className="category-actions">
                                <button
                                  className="field-action-btn field-edit-btn"
                                  onClick={() => handleEditCategory(category.id)}
                                  title="Edit category"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  className="field-action-btn field-delete-btn"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  title="Delete category"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="checklist-items">
                              {category.items.map((item) => (
                                <div key={item.id} className="checklist-item">
                                  <span className="checklist-item-name">{item.name}</span>
                                  <button
                                    className="field-action-btn field-delete-btn"
                                    onClick={() => handleDeleteChecklistItem(category.id, item.id)}
                                    title="Delete item"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                </div>
                              ))}

                              <ChecklistItemInput
                                categoryId={category.id}
                                onAddItem={handleAddChecklistItem}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={`category-form-section ${showCategoryForm ? 'expanded' : ''}`}>
                      {!showCategoryForm ? (
                        <button
                          className="add-field-btn"
                          onClick={() => setShowCategoryForm(true)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          Create Inspection Category
                        </button>
                      ) : (
                        <div className="category-form">
                          <div className="form-group">
                            <label className="form-label">Category Name <span className="required-asterisk">*</span></label>
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => {
                                setNewCategoryName(e.target.value);
                                if (checklistErrors.categoryName) {
                                  setChecklistErrors(prev => ({ ...prev, categoryName: '' }));
                                }
                              }}
                              placeholder="e.g., Exterior Analysis, Interior & Electrical"
                              className={`form-input ${checklistErrors.categoryName ? 'error' : ''}`}
                            />
                            {checklistErrors.categoryName && (
                              <span className="error-message">{checklistErrors.categoryName}</span>
                            )}
                          </div>
                          <div className="form-actions">
                            <button
                              type="button"
                              className="field-secondary-btn"
                              onClick={() => {
                                setShowCategoryForm(false);
                                setEditingChecklistCategoryId(null);
                                setNewCategoryName('');
                                setChecklistErrors(prev => ({ ...prev, categoryName: '' }));
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="field-primary-btn"
                              onClick={editingChecklistCategoryId ? handleUpdateCategory : handleAddCategory}
                            >
                              {editingChecklistCategoryId ? 'Update Category' : 'Add Category'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Checklist Item Input Component
const ChecklistItemInput = ({ categoryId, onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim()) {
      onAddItem(categoryId, itemName);
      setItemName('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        className="add-checklist-item-btn"
        onClick={() => setIsAdding(true)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add Checklist Item
      </button>
    );
  }

  return (
    <form className="checklist-item-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="e.g., Front Bumper, Dashboard Condition"
        className="form-input"
        autoFocus
        onBlur={() => {
          if (!itemName.trim()) {
            setIsAdding(false);
          }
        }}
      />
      <div className="checklist-item-actions">
        <button
          type="button"
          className="checklist-cancel-btn"
          onClick={() => {
            setIsAdding(false);
            setItemName('');
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="checklist-add-btn"
          disabled={!itemName.trim()}
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default ManagerProductFields;