import pandas as pd

# Load anime_with_synopsis.csv
df = pd.read_csv('./data/anime_with_synopsis.csv')

print(f"Total anime with synopsis: {len(df)}")
print(f"Columns: {list(df.columns)}")
print(f"\nFirst few records:")
print(df.head(3)[['MAL_ID', 'Name', 'Score', 'Genres']])

# Check synopsis column (note: might be 'sypnopsis' - typo in original)
synopsis_col = 'sypnopsis' if 'sypnopsis' in df.columns else 'synopsis'
print(f"\nSynopsis column: '{synopsis_col}'")
print(f"Non-null synopsis count: {df[synopsis_col].notna().sum()}")
print(f"Percentage with synopsis: {df[synopsis_col].notna().sum() / len(df) * 100:.1f}%")

print(f"\nSample synopsis (first anime):")
print(df.iloc[0][synopsis_col][:400])
