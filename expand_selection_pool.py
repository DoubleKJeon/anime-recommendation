"""
Create expanded anime selection pool from anime_with_synopsis.csv
Extracts top 1,500 anime by score for selection stage
"""

import pandas as pd
import json

print("="*60)
print("Expanding Anime Selection Pool")
print("="*60)

# Load full dataset
df = pd.read_csv('./data/anime_with_synopsis.csv')

print(f"\nTotal anime in database: {len(df)}")

# Filter and sort
# 1. Must have valid score
df_valid = df[df['Score'].notna()].copy()
print(f"Anime with scores: {len(df_valid)}")

# 2. Convert Score to numeric
df_valid['Score'] = pd.to_numeric(df_valid['Score'], errors='coerce')
df_valid = df_valid[df_valid['Score'] > 0]

# 3. Sort by score (descending)
df_sorted = df_valid.sort_values('Score', ascending=False)

# 4. Take top 1500
top_1500 = df_sorted.head(1500)

print(f"Selected top 1,500 anime by score")
print(f"Score range: {top_1500['Score'].min():.2f} - {top_1500['Score'].max():.2f}")

# Convert to JSON format matching popular_animes.json structure
anime_list = []

for idx, row in top_1500.iterrows():
    anime_list.append({
        'anime_id': int(row['MAL_ID']),
        'title': row['Name'],
        'image_url': '',  # Will be empty for most, frontend should handle this
        'score': float(row['Score']),
        'genres': row['Genres'] if pd.notna(row['Genres']) else '',
        'synopsis': row['sypnopsis'][:200] + '...' if pd.notna(row['sypnopsis']) and len(row['sypnopsis']) > 200 else row['sypnopsis'] if pd.notna(row['sypnopsis']) else '',
        'episodes': 0,  # Not available in this dataset
        'year': None
    })

# Save to new file
output_path = './data/expanded_animes.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(anime_list, f, ensure_ascii=False, indent=2)

print(f"\n✅ Created {output_path}")
print(f"   Total anime: {len(anime_list)}")
print(f"\nSample (top 5):")
for i, anime in enumerate(anime_list[:5], 1):
    print(f"{i}. {anime['title']} - Score: {anime['score']}")

# Also save to popular_animes.json (backup old one)
import shutil
import os

if os.path.exists('./data/popular_animes.json'):
    shutil.copy('./data/popular_animes.json', './data/popular_animes.json.backup')
    print(f"\n✅ Backed up old popular_animes.json")

shutil.copy(output_path, './data/popular_animes.json')
print(f"✅ Replaced popular_animes.json with expanded version")

print("\n" + "="*60)
print("EXPANSION COMPLETE")
print("="*60)
print(f"Before: 100 anime")
print(f"After: 1,500 anime")
print(f"Increase: 15x more selection!")
print("="*60)
