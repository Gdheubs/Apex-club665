import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadContent = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contentType: 'free',
        tokenPrice: '',
        tags: []
    });
    const [errors, setErrors] = useState({});

    const contentTypes = [
        { value: 'free', label: 'Free Content' },
        { value: 'premium', label: 'Premium Content' }
    ];

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
    };

    const handleFiles = (newFiles) => {
        // Filter for images and videos only
        const validFiles = newFiles.filter(file => 
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );

        if (validFiles.length !== newFiles.length) {
            setErrors(prev => ({
                ...prev,
                files: 'Only image and video files are allowed'
            }));
        }

        setFiles(prev => [...prev, ...validFiles]);
        setErrors(prev => ({ ...prev, files: '' }));
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                }));
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (formData.contentType === 'premium' && !formData.tokenPrice) {
            newErrors.tokenPrice = 'Token price is required for premium content';
        }

        if (files.length === 0) {
            newErrors.files = 'Please select at least one file to upload';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setUploading(true);

        try {
            // Simulate file upload with progress
            for (let i = 0; i < files.length; i++) {
                for (let progress = 0; progress <= 100; progress += 10) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    setUploadProgress(prev => ({
                        ...prev,
                        [i]: progress
                    }));
                }
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Navigate to the content feed after successful upload
            navigate('/feed');

        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'Failed to upload content. Please try again.'
            }));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="card backdrop-blur-lg">
                    <h1 className="heading-secondary mb-8">Upload Content</h1>

                    {errors.submit && (
                        <div className="mb-6 p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-700">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload Area */}
                        <div 
                            className={`border-2 border-dashed rounded-lg p-8 text-center ${
                                dragActive ? 'border-apex-gold bg-apex-gold/10' : 'border-gray-700'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileInput}
                                className="hidden"
                            />

                            <div className="space-y-4">
                                <i className="fas fa-cloud-upload-alt text-4xl text-apex-gold"></i>
                                <div>
                                    <p className="text-lg mb-2">
                                        Drag and drop your files here, or{' '}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-apex-gold hover:text-apex-gold/80 transition-colors"
                                        >
                                            browse
                                        </button>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Supported formats: Images (PNG, JPG, GIF) and Videos (MP4, WebM)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {errors.files && (
                            <p className="form-error text-center">{errors.files}</p>
                        )}

                        {/* Selected Files */}
                        {files.length > 0 && (
                            <div className="space-y-4">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="bg-apex-gray/50 rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <i className={`fas fa-${file.type.startsWith('image/') ? 'image' : 'video'} text-apex-gold`}></i>
                                            <div>
                                                <p className="font-medium">{file.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            {uploading && uploadProgress[index] !== undefined && (
                                                <div className="w-20">
                                                    <div className="h-1 bg-apex-gray rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-apex-gold transition-all duration-300"
                                                            style={{ width: `${uploadProgress[index]}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-400 transition-colors"
                                                disabled={uploading}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Content Details */}
                        <div className="space-y-6">
                            {/* Title */}
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`input-field w-full ${errors.title ? 'border-red-500' : ''}`}
                                    placeholder="Enter a title for your content"
                                    disabled={uploading}
                                />
                                {errors.title && (
                                    <p className="form-error">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`input-field w-full h-32 resize-none ${errors.description ? 'border-red-500' : ''}`}
                                    placeholder="Describe your content..."
                                    disabled={uploading}
                                ></textarea>
                                {errors.description && (
                                    <p className="form-error">{errors.description}</p>
                                )}
                            </div>

                            {/* Content Type */}
                            <div className="form-group">
                                <label htmlFor="contentType" className="form-label">Content Type</label>
                                <select
                                    id="contentType"
                                    name="contentType"
                                    value={formData.contentType}
                                    onChange={handleChange}
                                    className="input-field w-full"
                                    disabled={uploading}
                                >
                                    {contentTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Token Price (for premium content) */}
                            {formData.contentType === 'premium' && (
                                <div className="form-group">
                                    <label htmlFor="tokenPrice" className="form-label">Token Price</label>
                                    <input
                                        type="number"
                                        id="tokenPrice"
                                        name="tokenPrice"
                                        value={formData.tokenPrice}
                                        onChange={handleChange}
                                        className={`input-field w-full ${errors.tokenPrice ? 'border-red-500' : ''}`}
                                        placeholder="Enter token price"
                                        min="1"
                                        disabled={uploading}
                                    />
                                    {errors.tokenPrice && (
                                        <p className="form-error">{errors.tokenPrice}</p>
                                    )}
                                </div>
                            )}

                            {/* Tags */}
                            <div className="form-group">
                                <label htmlFor="tags" className="form-label">Tags</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        id="tags"
                                        className="input-field w-full"
                                        placeholder="Type a tag and press Enter"
                                        onKeyDown={handleTagInput}
                                        disabled={uploading}
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-apex-gray px-3 py-1 rounded-full text-sm flex items-center"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    disabled={uploading}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`btn-primary w-full flex items-center justify-center ${
                                uploading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-cloud-upload-alt mr-2"></i>
                                    Upload Content
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Privacy Notice */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Your content is protected by Apex Club's advanced security system
                </div>
            </div>
        </div>
    );
};

export default UploadContent;