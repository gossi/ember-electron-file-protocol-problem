import Controller from '@ember/controller';

const dialog = requireNode('electron').remote.dialog;

export default Controller.extend({
	canPlay: false,

	actions: {
		open() {
			this.set('file', null);
			this.set('canPlay', false);
			dialog.showOpenDialog({properties: ['openFile']}, (paths) => {
				if (paths && paths.length && paths.length > 0) {
					this.set('file', paths[0]);

					this.canPlayVideo('file://' + paths[0]).then(() => {
						this.set('canPlay', true);
					}, (err) => {
						console.log('cannot play video', err);
						this.set('canPlay', false);
					});
				}
			});
		}
	},

	canPlayVideo(location) {
		return new Promise((resolve, reject) => {
			const video = document.createElement('video');
			video.src = location;
			video.addEventListener('error', (err) => {
				reject(err);
			});
			video.addEventListener('canplay', (e) => {
				video.play().then(() => {
					video.pause();
					resolve();
				}, (e) => {
					reject(e);
				});
			});
		});
	}
});
