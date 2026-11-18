import { createInMemoryBackend } from '../InMemoryBackend';

describe('rating system', () => {
  it('stores a submitted rating and returns it in my ratings', async () => {
    const backend = createInMemoryBackend();

    await backend.reviews.submitRating({
      spotId: 'klib',
      stars: 5,
      subScores: {},
      busyLevel: null,
      tags: ['go early'],
      text: 'great study spot',
    });

    const ratings = await backend.profiles.listMyRatings();

    expect(ratings[0]).toMatchObject({
      spotId: 'klib',
      stars: 5,
    });
  });

  it('replaces an existing rating for the same spot', async () => {
    const backend = createInMemoryBackend();

    await backend.reviews.submitRating({
      spotId: 'klib',
      stars: 3,
      subScores: {},
      busyLevel: null,
      tags: [],
      text: 'first rating',
    });

    await backend.reviews.submitRating({
      spotId: 'klib',
      stars: 5,
      subScores: {},
      busyLevel: null,
      tags: [],
      text: 'updated rating',
    });

    const ratings = await backend.profiles.listMyRatings();
    const klibRatings = ratings.filter((rating) => rating.spotId === 'klib');

    expect(klibRatings).toHaveLength(1);
    expect(klibRatings[0].stars).toBe(5);
  });
});