import View from './view.js'
import FormView from './form_view.js';

export default class ListView extends View {
  constructor(storage_service, view_model) {
		super(storage_service, view_model['list']);
		this.entityViewModel = view_model;
  }
	get columns() { return this.viewModel.columns; }
  get $deleteModal() { return $("#" + this.viewModel.deleteModalContainerId); }
	async getViewData() { 
		var data = await this.storage.list();
		return data; 
	}
	async editItem(id) {
    this._formView = new FormView(this.storage, this.entityViewModel, this);
		this._formView.currentItemId = id;
		await this._formView.renderHelper();
  }
  async createItem() { 
		this.editItem(null); 
	}
  async bindItemEvents() {
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
				that.render();
			});
		}
    this.initPopover();
		
    $("#formContainer").on("show.bs.modal", function(ev) {
      let button = ev.relatedTarget
			let row_item_id = $(button).closest("tr").attr('data-id');
			that.editItem(row_item_id);
    });
  }
  async bindWrapperEvents() {
		let that=this;
    let $teamDeleteModal = this.$deleteModal;

    $("#modalTeamConfirmDelete").on("show.bs.modal", function(ev) {
      let button = ev.relatedTarget
			let row_item_id = $(button).closest("tr").attr('data-id');
			let data_item = that.curData[that.storage.getItemIndex(row_item_id)];
			let data_name = data_item[that.viewModel.nameCol];
			var $modalTitle = $('.modal-title');
			$modalTitle.text(`Delete team ${data_name}?`);
			$("#modalTeamConfirmDelete").attr('data-id', row_item_id);
			$("#modalTeamConfirmDelete").attr('data-name', data_name);
    });

    $("#confirmDelete").click((e) => {  
      let item_name = $teamDeleteModal.attr("data-name");
      let item_id = $teamDeleteModal.attr("data-id");
      this.addAlertDeleted(that.entityViewModel.entitySingle, item_name);
			this.deleteListItem(item_id).then((out) => {
				this.renderItem();
			}).catch((e) => {
				console.error(e);
			});        
    }) 
		
    $('#searchInput').on("input", (e) => {                      
    	this.searchVal = $(e.target).val();
			if ($(e.target).val() == '') {
				this.storage.filterStr = "";
      	this.renderItem();
			}
      this.runSearch();
    });
        
    $('#clearSearch').off("click").on("click", (e) => {
      $('#searchInput').val("");
      this.storage.filterStr = "";
      this.renderItem();
    });

		$('#resetView').on("click", (e) => {
      this.reset();
    });

		$('#createNew').on("click", (e) => {
			this.createItem();	
			//$("#deleteTeamConfirmationModal").modal("show");
    });

		$('#showModal').on("click", (e) => {
			this.createItem();	
			$("#formContainer").modal("show");
    });
  }

	addAlertDeleted(item_type, item_name) {
  	let alert_html=`<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>You deleted the following ${item_type}: ${item_name}</span>
    	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  	$('#alertCityBaby').html(alert_html);
  }
	
  runSearch() {
    clearTimeout(this.searchWaiter);
    this.searchWaiter = setTimeout(() => {
      if (this.searchVal.length > 1) {
        this.storage.filterStr = this.searchVal;
        this.storage.filterCol = this.storage.sortCol;
        this.renderItem();         
      } 
    }, 250);
  }

	async deleteListItem(team_id) {
    await this.storage.delete(team_id);
    await this.renderItem();
  }

  initPopover() {
    let that=this;
    $('[data-bs-toggle="popover"]').popover( {
      html: true,
      trigger : 'hover',
      delay: { 
        show: 400, 
        hide: 200
      },
      title : function() {
        var ix = $(this).attr("data-id");
        let item = that.curData[that.storage.getItemIndex(ix)];
        return `<h5>${item[that.viewModel.nameCol]}</h5>`;
      },
			
      content : function() {
        var ix = $(this).attr("data-id");
        let item = that.curData[that.storage.getItemIndex(ix)];
        let html_content = "";
        that.columns.forEach((col, index)=> {
          if (col.popover)	
            html_content += `<p>${col.label}: ${item[col.name]}</p>`;
        })
        return html_content;
      }
    });
  }
}