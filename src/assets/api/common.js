let url = '/proxy';

export default {
	getUser: url + '/getUser',
	logout: url + '/logout',
	uploadFile: url + '/api/upload/file', // 单文件上传
	uploadFiles: url + '/api/upload/files', // 多文件上传
}