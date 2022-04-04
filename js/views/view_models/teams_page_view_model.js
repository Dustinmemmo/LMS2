import mockTeamData from '../../models/mock_data/mock_team_data.js'

var teamViewModel = {
  entity: "teams",
  entitySingle: "team", 
  data: mockTeamData,
  list: {
    deleteModalContainerId:"modalTeamConfirmDelete", 
    editModalContainerId:"modalTeamEdit",
    alertContainerId: "alertContainer",
    wrapperContainerId: "teamPageWrapper",
    wrapperTemplateUrl: "js/views/partials/list_view_wrapper.ejs",
    templateUrl: "js/views/partials/list_view.ejs",
    containerId:"tableContainer", 
    searchInputId: "searchInput",
    resetButtonId: "resetView",
    newButtonId: "newButton",
    clearSearchButtonId: "clearSearch",
    options: {
      sortCol: "name",
      sortDir: "asc",
      limit: "",
      offset: "",
      filterCol: "",
      filterStr: ""
    },
    listTitle: "RLCS Teams - North America",     
    id: "my-list",
    tableClasses: "table table-striped",
    thClasses:"",       
    nameCol: "name",
    enablePopovers: true,
    columns: [ {
      label: "Rank",
    	name: "rank",
      popover: "true"
		}, {
      label: "Team Name",
      name: "name",
      popover: "true"
    }, {
      label: "Matches",
      name: "matches",
      popover: "true"
		}, {
      label: "Games",
      name: "games",
      popover: "true"
    } ] 
	},
  form: {
    id: "team-form",
    wrapperContainerId: "",
    wrapperTemplateUrl: "",
    templateUrl: "js/views/partials/form_view.ejs",
    containerId:"formContainer",       
    addFormTitle: "Add Team",
    editFormTitle: "Edit Team",
    actionUrl: "",
    method: "POST",
    fields: [ {
      label: "id",
      name: "id",
      tag: "input",
      defaultValue:"",
      attributes: { type: "hidden", },
      validation: { required: false,}
    }, {
    	label: "Rank",
    	name: "rank",
    	tag: "input",
      defaultValue:"",
      attributes: { 
        type: "text",
        placeholder: "Rank",
        class: "form-control"
    	},
	    validation: {
      	required: true,
      	requiredMessage: "Team Rank is required"
      }
    }, {
      label: "Team Name",
      name: "name",
      tag: "input",
      defaultValue:"",
      attributes: {
        type: "text",
        placeholder: "Team Name",
        class: "form-control"
      },
      validation: {
        required: true,
      	requiredMessage: "Team Name is required"
      }
    }, {
      label: "Matches",
      name: "matches",
      tag: "input",
      defaultValue:"",
      attributes: {
        type: "text",
        placeholder: "matches",
        title: 'W#-L#',
        class: "form-control"
      },
      validation: {
        required: true,
        requiredMessage: "Matches W-L is required"
      }
    }, {
      label: "Games",
      name: "games",
      tag: "input",
      defaultValue:"",
      attributes: {
        type: "text",
        placeholder: "W#-L#",
        class: "form-control"
      },
      validation: {
        required: true,
        requiredMessage: "Game W-L is required"
      }
    } ]       
  }   
}

export default teamViewModel;