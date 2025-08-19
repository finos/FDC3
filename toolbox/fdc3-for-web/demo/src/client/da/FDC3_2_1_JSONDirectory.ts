import { BasicDirectory } from '@finos/fdc3-web-impl/src/directory/BasicDirectory';
import { DirectoryApp } from '@finos/fdc3-web-impl/src/directory/DirectoryInterface';

async function loadRemotely(u: string) {
  try {
    const response = await fetch(u);
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${u}: ${error}`);
    return [];
  }
}

async function load(urls: string[]): Promise<DirectoryApp[]> {
  const promises = Promise.all(
    urls.map(async url => {
      if (url.startsWith('http')) {
        return loadRemotely(url).then(convertToDirectoryList);
      } else {
        return loadRemotely(window.location.origin + url).then(convertToDirectoryList);
      }
    })
  );

  return (await promises).flat();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertToDirectoryList = (data: any): DirectoryApp[] => {
  return data.applications as DirectoryApp[];
};

export class FDC3_2_1_JSONDirectory extends BasicDirectory {
  constructor() {
    super([]);
  }

  async load(urls: string[]) {
    const aa = this.allApps;
    const apps = await load(urls);

    apps.forEach((app: DirectoryApp) => {
      if (app) {
        const existing = aa.find(a => a.appId == app.appId);
        if (!existing) {
          aa.push(app);
        }
      }
    });
  }
}
