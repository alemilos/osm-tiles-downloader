const path = require("path");

const DEFAULT_URL = "https://tile.openstreetmap.org/";
const DEFAULT_OUTPUT = path.join("", Date.now().toString());

class DownloadManager {
  constructor(params) {
    this.url = DEFAULT_URL;
    this.startDelay = 10 * 1000; // 10 seconds
    this.output = params.output || DEFAULT_OUTPUT;
    this.failed = []; // failed requests queue
  }

  async start() {
    await this._delay(); // wait before starting
    await this._download();

    if (this.failed.length > 0) {
      await this._retry();
    }
  }

  _download() {
    return new Promise((resolve, reject) => {});
  }

  _retry() {
    return new Promise((resolve, reject) => {
      // manage failed requests
    });
  }

  /**
   * Delay before starting the download
   * @returns
   */
  _delay() {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, this.startDelay);
    });
  }
}
