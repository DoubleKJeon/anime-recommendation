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
        console.log('[Recommend API] Starting recommendation for:', selectedAnimeIds);

        // Python 스크립트 실행
        const pythonScript = path.join(process.cwd(), 'lib', 'recommender.py');
        console.log('[Recommend API] Python script path:', pythonScript);
        console.log('[Recommend API] Current working directory:', process.cwd());

        const python = spawn('python', [pythonScript, JSON.stringify(selectedAnimeIds)]);

        let dataString = '';
        let errorString = '';

        python.stdout.on('data', (data) => {
            const chunk = data.toString();
            console.log('[Python stdout]:', chunk);
            dataString += chunk;
        });

        python.stderr.on('data', (data) => {
            const chunk = data.toString();
            console.error('[Python stderr]:', chunk);
            errorString += chunk;
        });

        python.on('close', (code) => {
            console.log('[Recommend API] Python process closed with code:', code);
            console.log('[Recommend API] Full stdout:', dataString);
            console.log('[Recommend API] Full stderr:', errorString);

            if (code !== 0) {
                console.error('[Recommend API] Python error:', errorString);
                return res.status(500).json({
                    error: 'Recommendation failed',
                    details: errorString || 'Unknown error',
                    pythonExitCode: code
                });
            }

            try {
                const recommendations = JSON.parse(dataString);
                console.log('[Recommend API] Successfully parsed recommendations:', recommendations.length);
                res.status(200).json({ recommendations });
            } catch (parseError) {
                console.error('[Recommend API] Parse error:', parseError);
                console.error('[Recommend API] Raw data:', dataString);
                res.status(500).json({
                    error: 'Failed to parse recommendations',
                    rawData: dataString.substring(0, 200)
                });
            }
        });

    } catch (error) {
        console.error('[Recommend API] Caught error:', error);
        res.status(500).json({ error: 'Internal server error', details: String(error) });
    }
}
