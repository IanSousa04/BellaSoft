import React from 'react';
import { Box, Typography, Link, useTheme, useMediaQuery } from '@mui/material';
import { Instagram } from 'lucide-react';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        padding: isMobile ? '16px' : '20px',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
        position: 'relative',
        bottom: 0,
        left: 0,
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ mb: isMobile ? 1 : 0 }}
      >
        © {new Date().getFullYear()} BellaSoft. Todos os direitos reservados.
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Desenvolvido por Ian Sousa
        </Typography>
        <Link 
          href="https://www.instagram.com/iansousa_04" 
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.primary.main,
            '&:hover': {
              color: theme.palette.primary.dark,
            }
          }}
        >
          <Instagram size={20} />
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;