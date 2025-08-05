
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CardHeader(props) {
  const { title, subheader, avatar, action, sx, ...other } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, ...sx }} {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {avatar && <Box sx={{ mr: 1 }}>{avatar}</Box>}
        <Box>
          {title && (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )}
          {subheader && (
            <Typography variant="subtitle2" color="text.secondary">
              {subheader}
            </Typography>
          )}
        </Box>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
}

CardHeader.propTypes = {
  action: PropTypes.node,
  avatar: PropTypes.node,
  subheader: PropTypes.node,
  sx: PropTypes.object,
  title: PropTypes.node,
};

export default CardHeader;
