
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Film, RefreshCw, Clock } from 'lucide-react';
import { useMovieLimit } from '@/hooks/useMovieLimit';
import { useMovieApi } from '@/hooks/useMovieApi';

const MoviePicker = () => {
  const [movie, setMovie] = useState<object>({});
  const { isLimitReached, loading: limitLoading, incrementCount, remainingClicks } = useMovieLimit();
  const { fetchRandomMovie, loading: apiLoading, error } = useMovieApi();

  const handleGetMovie = async () => {
    if (isLimitReached) return;
    const response = await fetchRandomMovie();
    if (response !== null) {
      await incrementCount(); 
      setMovie(response);
      console.log(response);
    }
  };

  const isLoading = limitLoading || apiLoading;

  if (limitLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 space-y-8">
      {/* App Title */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Film className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Random Movie Suggestions</h1>
        </div>
        <p className="text-muted-foreground">Discover your next favorite movie</p>
      </div>

      {/* Usage Counter */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>
          {isLimitReached 
            ? "Daily limit reached. Try again tomorrow."
            : `${remainingClicks} ${remainingClicks === 1 ? "suggestion" : "suggestions"} remaining today`
          }
        </span>
        <div className="text-xs">Resets every 24 hours</div>
      </div>

      {/* Main Button */}
      <Button
        onClick={handleGetMovie}
        disabled={isLimitReached || isLoading}
        size="lg"
        className="px-8 py-6 text-lg font-semibold min-w-[200px] relative"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Finding Movie...</span>
          </div>
        ) : isLimitReached ? (
          'Limit Reached'
        ) : (
          'Suggest a movie'
        )}
      </Button>

      {/* Movie Display */}
      {(movie || error) && (
        <Card className="w-full max-w-md p-6 text-center min-h-[120px] flex items-center justify-center">
          {error ? (
            <div className="text-destructive font-medium">
              {error} An error occured, please try again!
            </div>
          ) : movie ? (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground font-medium">
                Your Random Movie:
              </div>
              <div className="text-xl font-bold text-foreground leading-tight">
                {movie.title}
              </div>
              <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster of ${movie.title}`}
              className="mt-4 rounded shadow-md"
              />
              <div className="text-sm text-muted-foreground font-medium">
                Movie Overview:
              </div>
              <div className="text-base text-foreground leading-tight">
                {movie.overview}
              </div>
              {movie.release_date ? (
                <>
                  <div className="text-sm text-muted-foreground font-medium">
                    Movie Release Date:
                  </div>
                  <div className="text-base text-foreground leading-tight">
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                </>
              ) : null}
              {typeof movie.vote_average === 'number' ? (
                <>
                  <div className="text-sm text-muted-foreground font-medium">
                    Movie Score:
                  </div>
                  <div className="text-base text-foreground leading-tight">
                    {movie.vote_average.toFixed(2)}
                  </div>
                </>
              ) : null}
               </div>
              ) : null}
        </Card>
      )}
    </div>
  );
};

export default MoviePicker;
