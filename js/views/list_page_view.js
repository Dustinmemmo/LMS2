class ListPageView {
  constructor(storage_service, view_model) {
    this.storage = storage_service;
    this.viewModel = view_model;
    this.listTemplateHtml = "";
    this.wrapperTemplateHtml = "";
    this.searchWaiter = null;
  }
	
  get list() {
    return this.viewModel.list;
  }

  get view() { return this.viewModel; }
  get wrapperTemplateUrl() { return this.view.wrapperTemplateUrl; }
  get $wrapperContainer() { return $("#"+this.view.wrapperContainerId); }
  get $listContainer() { return $("#"+this.view.listContainerId); }
  get listTemplateUrl() { return this.view.listTemplateUrl; }
  get columns() { return this.view.list.columns; }
  get $alertContainer() { return $("#"+this.view.alertContainerId); }
  get $modal() { return $("#"+this.view.modalContainerId); }
  get $headerIcon() { return $(`#${this.storage.sortCol}-${this.storage.sortDir}`); }

  reset() {
    this.storage.reset();
    this.render();
  }
	
  async render() {
    await this.renderWrapper();
    await this.renderList();
  }

  async renderWrapper() {
    this.$wrapperContainer.empty();	
    if (!this.wrapperTemplateHtml.length > 0) {
      this.wrapperTemplateHtml = await this.getFileContents(this.wrapperTemplateUrl);
    }
    this.$wrapperContainer.html(ejs.render(this.wrapperTemplateHtml, { view: this.viewModel }));
    await this.bindWrapperEvents();
  }
	
  async renderList() {
    this.$listContainer.empty();
    this.data = await this.storage.list();
    if (!this.listTemplateHtml.length > 0) {
      this.listTemplateHtml = await this.getFileContents(this.listTemplateUrl);
    }
    this.$listContainer.html(ejs.render(this.listTemplateHtml, {view:this, data:this.data}));       
    this.$headerIcon.show();     
    this.bindListEvents(this.data);
  }
    
  bindListEvents(data) {
    let that = this;
		for(let col of this.columns) {
			$(`th[data-name='${col.name}']`).off("click").on("click", (e)=>{
				const data_name = $(e.currentTarget).attr("data-name");
				let current_directory = this.storage.sortDir;
				$(`#${data_name}-${current_directory}`).hide();
				if(that.storage.sortCol === data_name) {
					that.storage.sortDir = (current_directory == "asc" ? "desc" : "asc");
				}
				else {
					that.storage.sortDir = "asc";
				}
				$(`#${data_name}-${this.storage.sortDir}`).show()
				that.storage.sortCol = data_name;
				that.renderList();
			});
		}
    this.initPopover();
  }
	
  async bindWrapperEvents() {
    let that=this;
    let $myModal = this.$modal;

    $myModal.on("show.bs.modal", function(ev) {
      let button = ev.relatedTarget
			let row_item_id = $(button).closest("tr").attr('data-id');
			let data_item = that.data[that.storage.getItemIndex(row_item_id)];
			let data_name = data_item[that.list.nameCol];
			var $modalTitle = $('.modal-title');
			$modalTitle.text(`Delete team ${data_name}?`);
			$myModal.attr('data-id', row_item_id);
			$myModal.attr('data-name', data_name);
    });

    $("#confirmDelete").click((e) => {    
      let item_name = $myModal.attr("data-name");
      let item_id = $myModal.attr("data-id");
      this.addAlert(this.view.entitySingle, item_name);
			this.deleteListItem(item_id).then((out) => {
				this.renderList();
			}).catch((e) => {
				console.error(e);
			});        
    })
            
    $('#resetView').on("click", (e) => {
      this.reset();
    });
		
    $('#searchInput').on("input", (e) => {                      
    	this.searchVal = $(e.target).val();
      this.runSearch();
    });
        
    $('#clearSearch').off("click").on("click", (e) => {
      $('#searchInput').val("");
      this.storage.filterStr = "";
      this.renderList();
    });
  }
  
  addAlert(item_type, item_name) {
  	let alert_html=`<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>You deleted the following ${item_type}: ${item_name}</span>
    	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    this.$alertContainer.html(alert_html);
  }
	
  runSearch() {
    clearTimeout(this.searchWaiter);
    this.searchWaiter = setTimeout(() => {
      if (this.searchVal.length > 1) {
        this.storage.filterStr = this.searchVal;
        this.storage.filterCol = this.storage.sortCol;
        this.renderList();         
      } 
    }, 250);
  }
	
  async deleteListItem(team_id) {
    await this.storage.delete(team_id);
    await this.renderList();
  }
	
  initPopover() {
    let that=this;
    $('[data-bs-toggle="popover"]').popover( {
      html: true,
      trigger : 'hover',
      title : function() {
        var ix = $(this).attr("data-id");
        let item = that.data[that.storage.getItemIndex(ix)];
        return `<h5>${item[that.view.list.nameCol]}</h5>`;
      },
      content : function() {
        var ix = $(this).attr("data-id");
        let item = that.data[that.storage.getItemIndex(ix)];
        let html_content = "";
        that.columns.forEach((col, index)=> {
          if (col.popover)
            html_content += `<p>${col.label}: ${item[col.name]}</p>`;
        })
        return html_content;
      }
    });
  }
	
  async getFileContents(url){
    return await $.get(url);    
  }
}