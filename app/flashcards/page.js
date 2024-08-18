'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Make sure you import your Firebase config

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(window.location.search);
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        setLoading(false);
        return;
      }

      try {
        const colRef = collection(doc(collection(db, 'users'), user.id), search);
        const docs = await getDocs(colRef);
        const flashcards = [];
        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(flashcards);
      } catch (err) {
        setError('Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    }
    getFlashcard();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.length === 0 ? (
          <Typography variant="h6" align="center">No flashcards found.</Typography>
        ) : (
          flashcards.map((flashcard) => (
            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                  <CardContent>
                    <Box>
                      <div>
                        <Typography variant="h5" component="div">
                          {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}
