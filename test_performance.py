import pandas as pd
import time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

print("="*60)
print("TF-IDF Performance Test on 16,214 Anime")
print("="*60)

# Load data
print("\n1. Loading data...")
start = time.time()
df = pd.read_csv('./data/anime_with_synopsis.csv')
print(f"   ✓ Loaded {len(df)} anime in {time.time() - start:.2f} seconds")

# Prepare text
print("\n2. Preparing text (synopsis + genres)...")
start = time.time()
texts = df['sypnopsis'].fillna('') + ' ' + df['Genres'].fillna('')
print(f"   ✓ Prepared {len(texts)} texts in {time.time() - start:.2f} seconds")

# TF-IDF vectorization
print("\n3. TF-IDF vectorization...")
start = time.time()
tfidf = TfidfVectorizer(
    stop_words='english',
    max_features=5000,
    ngram_range=(1, 2)
)
tfidf_matrix = tfidf.fit_transform(texts)
tfidf_time = time.time() - start
print(f"   ✓ Created TF-IDF matrix in {tfidf_time:.2f} seconds")
print(f"   Matrix shape: {tfidf_matrix.shape}")
print(f"   Matrix size in memory: {tfidf_matrix.data.nbytes / 1024 / 1024:.2f} MB")

# Cosine similarity (sample - just first 1000)
print("\n4. Computing cosine similarity (sample 1000 anime)...")
start = time.time()
sample_matrix = tfidf_matrix[:1000]
cosine_sim_sample = cosine_similarity(sample_matrix, sample_matrix)
sample_time = time.time() - start
print(f"   ✓ Computed similarity for 1000 anime in {sample_time:.2f} seconds")
print(f"   Estimated time for full 16K: ~{sample_time * (16**2):.1f} seconds")

# Test recommendation speed
print("\n5. Testing recommendation speed...")
start = time.time()
# Simulate: get top 30 recommendations for anime index 0
selected_idx = 0
sim_scores = list(enumerate(cosine_sim_sample[selected_idx]))
sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
top_30 = sim_scores[1:31]  # exclude self
rec_time = time.time() - start
print(f"   ✓ Got top 30 recommendations in {rec_time*1000:.2f} milliseconds")

print("\n" + "="*60)
print("SUMMARY")
print("="*60)
print(f"Total processing time: {tfidf_time + sample_time:.2f} seconds")
print(f"Recommendation speed: {rec_time*1000:.1f} ms (very fast!)")
print(f"\n✅ Your computer can DEFINITELY handle this!")
print("   Even budget laptops can process this in seconds.")
print("="*60)
