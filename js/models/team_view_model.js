var teamViewModel = {
  entity: "teams",
  entitySingle: "team",
  wrapperContainerId: "teamPageWrapper",
  wrapperTemplateUrl: "js/views/partials/list_page_wrapper.ejs",
  listContainerId: "tableContainer",  
  listTemplateUrl: "js/views/partials/list_view.ejs",
  modalContainerId: "modalTeamConfirmDelete", 
  alertContainerId: "alertContainer",
  data: mockTeamData,
  list: {
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
    tableClasses: "table",
    thClasses:"",
    nameCol: "name",
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
  }   
}   