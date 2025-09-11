import React from 'react';
import { Box } from '@mui/material';

const RichTextDisplay = ({ content, sx = {} }) => {
    if (!content) return null;

    // Clean up the HTML content to ensure proper rendering
    const cleanContent = content.replace(/\n/g, '').trim();

    return (
        <Box
            sx={{
                // Ensure list styles are not reset
                listStyle: 'initial',
                '& p': {
                    margin: '0 0 8px 0',
                    lineHeight: 1.6,
                },
                '& ul': {
                    margin: '8px 0',
                    paddingLeft: '20px',
                    listStyleType: 'disc !important',
                    listStylePosition: 'outside !important',
                    marginLeft: '0px',
                },
                '& ol': {
                    margin: '8px 0',
                    paddingLeft: '20px',
                    listStyleType: 'decimal !important',
                    listStylePosition: 'outside !important',
                    marginLeft: '0px',
                },
                '& li': {
                    margin: '4px 0',
                    lineHeight: 1.6,
                    display: 'list-item !important',
                    listStylePosition: 'outside !important',
                },
                '& ul li': {
                    listStyleType: 'disc !important',
                },
                '& ol li': {
                    listStyleType: 'decimal !important',
                },
                '& strong': {
                    fontWeight: 600,
                },
                '& em': {
                    fontStyle: 'italic',
                },
                '& u': {
                    textDecoration: 'underline',
                },
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                    margin: '16px 0 8px 0',
                    fontWeight: 600,
                },
                '& blockquote': {
                    borderLeft: '4px solid #ccc',
                    paddingLeft: '16px',
                    margin: '16px 0',
                    fontStyle: 'italic',
                },
                '& code': {
                    backgroundColor: '#f5f5f5',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                },
                '& pre': {
                    backgroundColor: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    margin: '16px 0',
                },
                ...sx
            }}
            dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
    );
};

export default RichTextDisplay;