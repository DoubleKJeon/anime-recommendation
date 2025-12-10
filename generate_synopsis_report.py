import pandas as pd

# Load anime_with_synopsis.csv
df = pd.read_csv('./data/anime_with_synopsis.csv')

# Write report to file
with open('synopsis_data_report.txt', 'w', encoding='utf-8') as f:
    f.write("="*60 + "\n")
    f.write("ANIME WITH SYNOPSIS DATASET REPORT\n")
    f.write("="*60 + "\n\n")
    
    f.write(f"Total anime records: {len(df)}\n")
    f.write(f"Columns: {', '.join(df.columns)}\n\n")
    
    # Check synopsis column
    synopsis_col = 'sypnopsis' if 'sypnopsis' in df.columns else 'synopsis'
    f.write(f"Synopsis column name: '{synopsis_col}'\n")
    f.write(f"Non-null synopsis: {df[synopsis_col].notna().sum()}\n")
    f.write(f"Percentage with synopsis: {df[synopsis_col].notna().sum() / len(df) * 100:.1f}%\n\n")
    
    # Sample data
    f.write("First 5 anime:\n")
    f.write("-"*60 + "\n")
    for idx in range(min(5, len(df))):
        row = df.iloc[idx]
        f.write(f"\n{idx+1}. {row['Name']} (ID: {row['MAL_ID']})\n")
        f.write(f"   Score: {row['Score']}\n")
        f.write(f"   Genres: {row['Genres']}\n")
        if pd.notna(row[synopsis_col]):
            synopsis_text = row[synopsis_col][:200] + "..." if len(row[synopsis_col]) > 200 else row[synopsis_col]
            f.write(f"   Synopsis: {synopsis_text}\n")
        else:
            f.write(f"   Synopsis: [NONE]\n")
    
    f.write("\n" + "="*60 + "\n")
    f.write("COMPARISON WITH POPULAR_ANIMES.JSON\n")
    f.write("="*60 + "\n\n")
    f.write(f"anime_with_synopsis.csv: {len(df)} anime\n")
    f.write(f"popular_animes.json: 100 anime\n")
    f.write(f"Difference: {len(df) - 100} more anime available!\n")

print("Report saved to synopsis_data_report.txt")
