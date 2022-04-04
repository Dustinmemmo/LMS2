import View from './view.js'

export default class FormView extends View {
  constructor(storage_service, view_model, parent_view) {
    super(storage_service, view_model["form"])
    this.entityViewModel = view_model;
    this.currentItemId = null;
    this.parentView = parent_view;
    this.formChanged = false;
  }
  get fields() { return this.viewModel.fields }
  get formId() { return this.viewModel.id; }
  get $form() { return $("#" + this.formId); }
  get form() { return this.$form.get(0); }
  get formValid() { return this.form.checkValidity(); }
  get $inputs() { return $("#" + this.formId + " :input"); }
  async getViewData() {
    if(this.currentItemId) {
			this._data = await this.read(this.currentItemId);
		}
		else {
			this._data = {};
		}
  }
	async renderHelper() {
		this.curData = await this.getViewData();
		if (this.curData == null) { // Create New Team
			await this.renderTemplate( $("#formContainer"), "js/views/partials/form_view.ejs", {
				viewModel: this.viewModel,
				inst: {
					action: "Create New Team",
					id: this.storage.getNextId,
					rank: this.storage.getNextRank,
					name: "",
					matches: 0-0,
					games: 0-0
				}
			});
		}
		else { // Edit existing Team
			await this.renderTemplate(this.viewModel.editModalContainerId, "js/views/partials/form_view.ejs", {
				viewModel: this.viewModel,
				inst: {
					action: "Edit Existing Team",
					id: this.curData.id,
					rank: this.curData.rank,
					name: this.curData.name,
					matches: this.curData.matches,
					games: this.curData.games
				}
			});
		}
		this.bindItemEvents();
  }
	
  async bindItemEvents(data) {
		$('#addEditSubmitButton').on("click", (e) => {
			
    });
    //2. Bind the 'cancel' button on the form.  If form is changed, confirm before calling closeEditModal on the parentView
		$('#addEditCancelButton').on("click", (e) => {
			if(this.formChanged){
				alert("Are you sure you would like to cancel?")
			}
    });
    //3. Bind the 'change' event on all inputs to the 'change' method of this class
  }
  async bindWrapperEvents() {}
  
  submit = ev => {
    //1. prevent default action and stop propagation from happening
    //2. Call 'checkValidity' on the form to see if form is valid according to the DOM
    //3. Call the formValidated method to place .was-validated class on form
    //3. If it is valid,
    //  a. Get the form Data from the form
    //  b. Call storage.update with the form data object to update the item. use promise pattern
    //  c. Upon return from update, call the parent view 'renderItem' method to re-render just the list with the latest data
    //  d. Call the 'closeEditModal' function on the parentView to close the dialo

  }

  /*getFormData()-get the data from the form an package as a normal object for submit*/
  getFormData() {
    return Object.fromEntries(new FormData(this.form));
    //reference: https://gomakethings.com/serializing-form-data-with-the-vanilla-js-formdata-object/

  }

  /*change()-change event handler for inputs.  call fieldValidated to set the bootstrap classes. Set formChanged*/
  change = ev => {
    /*TODO
    1. get event element (use getEventEl method)
    2. call fieldValidated passing in the element to add the current .is-valid or .is-invalid classes
    3. set formChange=true so we know changes were made.  We'll use this later to confirm if someone hits the 'cancel' button
    */
  }

  /*getEventEl(ev)-get jquery wrapped element for event*/
  getEventEl(ev) {
    return $(ev.currentTarget);
  }

  /*fieldValidated($el)-TODO-remove validity classes and apply class for current state */
  fieldValidated($el) {
		$el.remove
	}

  /*formValidated()-TODO-simply add was-validated class to form*/
  formValidated() {
		
	}

}