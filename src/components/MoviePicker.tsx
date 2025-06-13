
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Film, RefreshCw, Clock } from 'lucide-react';
import { useMovieLimit } from '@/hooks/useMovieLimit';
import { useMovieApi } from '@/hooks/useMovieApi';

const MoviePicker = () => {
  const [movie, setMovie] = useState<object>({});
  const { clickCount, isLimitReached, loading: limitLoading, incrementCount, remainingClicks } = useMovieLimit();
  const { fetchRandomMovie, loading: apiLoading, error } = useMovieApi();

  const handleGetMovie = async () => {
    if (isLimitReached) return;

    await incrementCount();
    const response = await fetchRandomMovie();
    setMovie(movie);
    console.log(response);
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
          <h1 className="text-3xl font-bold text-foreground">Random Movie Picker</h1>
        </div>
        <p className="text-muted-foreground">Discover your next favorite film</p>
      </div>

      {/* Usage Counter */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>
          {isLimitReached 
            ? "Daily limit reached. Try again tomorrow."
            : `${remainingClicks} picks remaining today`
          }
        </span>
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
          'Get Random Movie'
        )}
      </Button>

      {/* Movie Display */}
      {(movie || error) && (
        <Card className="w-full max-w-md p-6 text-center min-h-[120px] flex items-center justify-center">
          {error ? (
            <div className="text-destructive font-medium">
              {error}
            </div>
          ) : movie ? (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground font-medium">
                Your Random Movie:
              </div>
              <div className="text-xl font-bold text-foreground leading-tight">
                {movie.title}
              </div>
              <div className="text-xl font-bold text-foreground leading-tight">
                {movie.overview}
              </div>
            </div>
          ) : null}
        </Card>
      )}

      {/* Usage Stats */}
      <div className="text-center space-y-1 text-sm text-muted-foreground">
        <div>Movies picked today: {clickCount}/5</div>
        <div className="text-xs">Resets every 24 hours</div>
      </div>
    </div>
  );
};

export default MoviePicker;
