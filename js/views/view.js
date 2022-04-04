import Utils from '../util/utilities.js'

export default class View {
  constructor(storage, view_model) {
    this.storage = storage;
    this.viewModel = view_model;
    this.utils = new Utils();
    this.data = null;
  }
  get $alertContainer() {
    return $("#" + this.viewModel.alertContainerId);
  } 
  get wrapperTemplateUrl() {
    return this.viewModel.wrapperTemplateUrl;
  }
  get $wrapperContainer() {
    return $("#" + this.viewModel.wrapperContainerId);
  }
  get $container() {
    return $("#" + this.viewModel.containerId);
  }
  get templateUrl() {
    return this.viewModel.templateUrl;
  }
  async render() {
    this.renderWrapper().then(() => { this.renderItem(); })
  }
  async renderTemplate($container, templateURL, vData) {
    $container.empty();
		let template = await this.utils.getFileContents(templateURL);	
		$container.html(ejs.render(template, vData));
  }
  async renderWrapper() {
		if (this.wrapperTemplateUrl) {
			this.curData = await this.getViewData();
			await this.renderTemplate(this.$wrapperContainer, this.wrapperTemplateUrl, {
				view: this,
				viewModel: this.viewModel,
				data: this.curData
			});
			this.bindWrapperEvents();
		}
  }
  async renderItem() {
    this.curData = await this.getViewData();
		await this.renderTemplate(this.$container, this.templateUrl, {
			view: this,
			viewModel: this.viewModel,
			data: this.curData
		});	
		this.bindItemEvents();
  } 
  async getViewData() {
    throw new Error("Must implement getViewData in sub class!")
  }
  async reset() {
    await this.storage.reset();
    await this.render();
  }
  async bindItemEvents() {
    throw new Error("Must implement bindItemEvents in sub class!")
  }
  async bindWrapperEvents() {
    throw new Error("Must implement bindWrapperEvents in sub class!")
  }
  readCachedItem(id) {   
    return this.storage.getItem(id);
  }
}