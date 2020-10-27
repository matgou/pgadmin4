/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2020, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

import {getTreeNodeHierarchyFromIdentifier} from '../../../../static/js/tree/pgadmin_tree_node';
import gettext from 'sources/gettext';

export function getDatabaseLabel(parentData) {
  return parentData.database ? parentData.database.label
    : parentData.server.db;
}

function isServerInformationAvailable(parentData) {
  return parentData.server === undefined;
}

export function getPanelTitle(pgBrowser, selected_item=null, custom_title=null) {
  var preferences = pgBrowser.get_preferences_for_module('sqleditor');
  if(selected_item == null) {
    selected_item = pgBrowser.treeMenu.selected();
  }

  const parentData = getTreeNodeHierarchyFromIdentifier
    .call(pgBrowser, selected_item);
  if (isServerInformationAvailable(parentData)) {
    return;
  }

  const db_label = getDatabaseLabel(parentData);
  var qt_title_placeholder = '';
  if (custom_title) {
    qt_title_placeholder = custom_title;
  } else {
    qt_title_placeholder = preferences['qt_tab_title_placeholder'];
  }

  qt_title_placeholder = qt_title_placeholder.replace(new RegExp('%DATABASE%'), db_label);
  qt_title_placeholder = qt_title_placeholder.replace(new RegExp('%USERNAME%'), parentData.server.user.name);
  qt_title_placeholder = qt_title_placeholder.replace(new RegExp('%SERVER%'), parentData.server.label);

  return _.escape(qt_title_placeholder);
}

export function setQueryToolDockerTitle(panel, is_query_tool, panel_title, is_file) {
  let panel_icon = '', panel_tooltip = '';

  if(is_file || is_file == 'true'){
    panel_tooltip = gettext('File - ') + panel_title;
    panel_icon = 'fa fa-file-alt';
  }
  else if (is_query_tool == 'false' || is_query_tool == false) {
    // Edit grid titles
    panel_tooltip = gettext('View/Edit Data - ') + panel_title;
    panel_icon = 'pg-font-icon icon-view-data';
  } else {
    // Query tool titles
    panel_tooltip = gettext('Query Tool - ') + panel_title;
    panel_icon = 'pg-font-icon icon-query-tool';
  }

  panel.title('<span title="'+ _.escape(panel_tooltip) +'">'+ _.escape(panel_title) +'</span>');
  panel.icon(panel_icon);
}
