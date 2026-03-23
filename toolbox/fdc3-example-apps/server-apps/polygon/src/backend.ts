export default function (app: any) {
  app.get('/polygon-key', (_req: any, res: any) => {
    res.json({ key: process.env.POLYGON_API_KEY ?? 'no-key' });
  });
}
