class AppController {
	constructor(appViewModel) {
  	this.appViewModel = appViewModel;
		this.storageService = new LocalStorageService(this.data, this.entity,this.list.options);
		this._view = new ListPageView(this.storageService, this.vModel)
	}
	get data() {return this.appViewModel.viewModel.data;}
  get entity() {return this.appViewModel.viewModel.entity;}
  get list() {return this.appViewModel.viewModel.list;}
  get vModel() {return this.appViewModel.viewModel;}
  get view() {
    return this._view;
  }
  async reset(){
    await this.view.reset();
  }
  async render(){
    await this.view.render();
  }
}