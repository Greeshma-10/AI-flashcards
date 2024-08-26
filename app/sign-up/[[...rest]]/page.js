import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#FF5722' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1,  textAlign:'center' }}>
            Flashcard SaaS
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: 'center', my: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </>
  );
}
