'use client';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useUser } from '@clerk/nextjs'; // or useAuth if you're using a different auth provider
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Ensure this path is correct

// Custom Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0000',
    },
    secondary: {
      main: '#C0C0C0',
    },
    background: {
      default: '#FFFFF0',
      paper: '#333333',
    },
    text: {
      primary: '#FFFFF0',
      secondary: '#333333',
    },
  },
});

// Function to fetch flashcards from Firestore
const fetchFlashcards = async (userId) => {
  try {
    // Reference to the user's flashcard sets collection
    const flashcardSetsRef = collection(db, `users/${userId}/flashcardSets`);
    const flashcardSetsSnap = await getDocs(flashcardSetsRef);

    // If there are no flashcard sets, return an empty array
    if (flashcardSetsSnap.empty) {
      console.log('No flashcard sets found.');
      return [];
    }

    // Map through the flashcard sets and fetch the flashcards for each set
    const flashcardSetsData = await Promise.all(
      flashcardSetsSnap.docs.map(async (setDoc) => {
        const setData = setDoc.data();
        const flashcardsRef = collection(db, `users/${userId}/flashcardSets/${setDoc.id}/flashcards`);
        const flashcardsSnap = await getDocs(flashcardsRef);

        const flashcards = flashcardsSnap.docs.map(doc => doc.data());
        return { ...setData, flashcards };
      })
    );

    console.log('Fetched flashcard sets data:', flashcardSetsData);
    return flashcardSetsData;

  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw new Error('An error occurred while fetching flashcards.');
  }
};

// React component to display flashcard sets
export default function ViewFlashcards() {
  const { user, isLoaded } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFlashcards = async () => {
      if (!isLoaded || !user) return;

      try {
        const sets = await fetchFlashcards(user.id);
        setFlashcardSets(sets);
      } catch (error) {
        console.error('Failed to load flashcards:', error);
        setError('An error occurred while fetching flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [user, isLoaded]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Flashcard Sets
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : flashcardSets.length > 0 ? (
            flashcardSets.map((set, index) => (
              <Box key={index} sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {set.name}
                </Typography>
                <Grid container spacing={2}>
                  {Array.isArray(set.flashcards) && set.flashcards.length > 0 ? (
                    set.flashcards.map((flashcard, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">Front:</Typography>
                            <Typography>{flashcard.front}</Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                            <Typography>{flashcard.back}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Typography variant="body1">No flashcards found for this set.</Typography>
                  )}
                </Grid>
              </Box>
            ))
          ) : (
            <Typography variant="h6" component="p">
              No flashcard sets found.
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
