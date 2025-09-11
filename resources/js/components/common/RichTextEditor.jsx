import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Typography } from '@mui/material';

const RichTextEditor = ({ 
    value, 
    onChange, 
    placeholder = "Enter text...", 
    label,
    error,
    helperText,
    height = 200,
    ...props 
}) => {
    // Custom toolbar configuration with MS Word-like features
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'list', 'bullet', 'indent',
        'align',
        'blockquote', 'code-block',
        'link', 'image'
    ];

    const handleChange = (content, delta, source, editor) => {
        onChange(content);
    };

    return (
        <Box sx={{ mb: 2 }}>
            {label && (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        mb: 1, 
                        fontWeight: 500,
                        color: error ? '#d32f2f' : '#555'
                    }}
                >
                    {label}
                </Typography>
            )}
            <Box 
                sx={{
                    '& .ql-editor': {
                        minHeight: `${height}px`,
                        fontSize: '14px',
                        lineHeight: 1.5,
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                    },
                    '& .ql-toolbar': {
                        borderTop: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
                        borderLeft: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
                        borderRight: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
                        borderBottom: 'none',
                        borderRadius: '4px 4px 0 0',
                        backgroundColor: '#fafafa'
                    },
                    '& .ql-container': {
                        borderBottom: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
                        borderLeft: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
                        borderRight: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
                        borderTop: 'none',
                        borderRadius: '0 0 4px 4px',
                        fontSize: '14px'
                    },
                    '& .ql-toolbar .ql-formats': {
                        marginRight: '15px'
                    },
                    '& .ql-toolbar button': {
                        padding: '5px',
                        margin: '1px'
                    },
                    '& .ql-toolbar button:hover': {
                        backgroundColor: '#e3f2fd'
                    },
                    '& .ql-toolbar .ql-active': {
                        backgroundColor: '#1976d2',
                        color: 'white'
                    },
                    '& .ql-editor.ql-blank::before': {
                        color: '#999',
                        fontStyle: 'italic'
                    }
                }}
            >
                <ReactQuill
                    value={value || ''}
                    onChange={handleChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    theme="snow"
                    {...props}
                />
            </Box>
            {helperText && (
                <Typography 
                    variant="caption" 
                    sx={{ 
                        mt: 0.5, 
                        color: error ? '#d32f2f' : '#666',
                        fontSize: '0.75rem'
                    }}
                >
                    {helperText}
                </Typography>
            )}
        </Box>
    );
};

export default RichTextEditor;