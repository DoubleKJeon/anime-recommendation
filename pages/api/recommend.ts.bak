import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { selectedAnimeIds } = req.body;

    if (!selectedAnimeIds || selectedAnimeIds.length !== 5) {
        return res.status(400).json({ error: '5개의 애니메이션을 선택해주세요' });
    }

    try {
        // Python 스크립트 실행
        const pythonScript = path.join(process.cwd(), 'lib', 'recommender.py');
        const python = spawn('python', [pythonScript, JSON.stringify(selectedAnimeIds)]);

        let dataString = '';
        let errorString = '';

        python.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                console.error('Python error:', errorString);
                return res.status(500).json({ error: 'Recommendation failed', details: errorString });
            }

            try {
                const recommendations = JSON.parse(dataString);
                res.status(200).json({ recommendations });
            } catch (parseError) {
                console.error('Parse error:', parseError);
                res.status(500).json({ error: 'Failed to parse recommendations' });
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
