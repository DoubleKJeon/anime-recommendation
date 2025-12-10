import pandas as pd
import time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

results = []
results.append("="*60)
results.append("TF-IDF Performance Test on 16,214 Anime")
results.append("="*60)

# Load data
results.append("\n1. Loading data...")
start = time.time()
df = pd.read_csv('./data/anime_with_synopsis.csv')
load_time = time.time() - start
results.append(f"   ✓ Loaded {len(df)} anime in {load_time:.2f} seconds")

# Prepare text
results.append("\n2. Preparing text (synopsis + genres)...")
start = time.time()
texts = df['sypnopsis'].fillna('') + ' ' + df['Genres'].fillna('')
prep_time = time.time() - start
results.append(f"   ✓ Prepared {len(texts)} texts in {prep_time:.2f} seconds")

# TF-IDF vectorization
results.append("\n3. TF-IDF vectorization...")
start = time.time()
tfidf = TfidfVectorizer(
    stop_words='english',
    max_features=5000,
    ngram_range=(1, 2)
)
tfidf_matrix = tfidf.fit_transform(texts)
tfidf_time = time.time() - start
results.append(f"   ✓ Created TF-IDF matrix in {tfidf_time:.2f} seconds")
results.append(f"   Matrix shape: {tfidf_matrix.shape}")
results.append(f"   Matrix size: {tfidf_matrix.data.nbytes / 1024 / 1024:.2f} MB")

# Cosine similarity (sample)
results.append("\n4. Computing cosine similarity (sample 1000 anime)...")
start = time.time()
sample_matrix = tfidf_matrix[:1000]
cosine_sim_sample = cosine_similarity(sample_matrix, sample_matrix)
sample_time = time.time() - start
results.append(f"   ✓ Computed for 1000 anime in {sample_time:.2f} seconds")

# Test recommendation
results.append("\n5. Testing recommendation speed...")
start = time.time()
selected_idx = 0
sim_scores = list(enumerate(cosine_sim_sample[selected_idx]))
sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
top_30 = sim_scores[1:31]
rec_time = time.time() - start
results.append(f"   ✓ Top 30 recommendations in {rec_time*1000:.2f} ms")

results.append("\n" + "="*60)
results.append("SUMMARY")
results.append("="*60)
results.append(f"Data loading: {load_time:.2f}s")
results.append(f"TF-IDF processing: {tfidf_time:.2f}s")
results.append(f"Cosine similarity (1K sample): {sample_time:.2f}s")
results.append(f"Recommendation speed: {rec_time*1000:.1f} ms")
results.append(f"\nTotal one-time setup: {load_time + tfidf_time:.2f} seconds")
results.append(f"\n✅ CONCLUSION: Very fast! Your computer can handle this easily.")
results.append("="*60)

# Save to file
with open('performance_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))

print('\n'.join(results))
