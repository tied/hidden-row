/*
define('com.mesilat/editor',['ajs','jquery'],function(AJS,$) {

    function isSharpKey(e) {
        return e && e.shiftKey && !e.ctrlKey && !e.altKey && !e.altGraphKey && !e.metaKey && e.which === 35;
    }

    var initialized = false;
    var editorKeypressHandler = function(ed, e) {
        if (isSharpKey(e)){
            console.log('CME', 'select CRM object');
        }
    };

    return {
        init: function () {
            if (!initialized){
                initialized = true;
                AJS.Rte.BootstrapManager.addOnInitCallback(function() {
                    AJS.Rte.getEditor().onKeyPress.addToTop(editorKeypressHandler);
                });
            }
        }
    };
});
*/

define('com.mesilat/crm-autocomplete-settings-links', ['jquery','ajs','confluence/legacy'], function($,AJS,Confluence){
    "use strict";

    function AutocompleteSettingsLink() {
        var autoComplete = Confluence.Editor.Autocompleter;

        var getUrl = function(val) {
            if (val) {
                return AJS.contextPath() + "/rest/prototype/1/search.json";
            } else if (AJS.Meta.get('remote-user')) {
                return AJS.contextPath() + "/rest/prototype/1/session/history.json";
            }

            return null;
        };

        var getParams = function(autoCompleteControl, val) {
            var params = {
                "max-results": autoCompleteControl.maxResults
            };
            if (val) {
                params.query = Confluence.unescapeEntities(val);
                params.search = "name";
                params.preferredSpaceKey = AJS.Meta.get('space-key');
            }
            return params;
        };

        // Link settings.
        Confluence.Editor.Autocompleter.Settings["#"] = {
            ch: "#",
            cache: false,
            endChars: [],

            dropDownClassName: "autocomplete-links",
            selectFirstItem: true,

            getHeaderText: function (autoCompleteControl, value) {
                return "Contacts and Clients";
            },

            getAdditionalLinks: function (autoCompleteControl, value, restSpecificAdditionLinksCallback) {
                var searchPrompt;
                if (value) {
                    var message = "Search for &lsquo;{0}&rsquo;";
                    searchPrompt = AJS.format(message, value);
                } else {
                    searchPrompt = "Search";
                }
                var LinkBrowser = Confluence.Editor.LinkBrowser;
                var additionalLinks = [
                    {
                        className: "search-for",
                        name: searchPrompt,
                        href: "#",
                        callback: function (autoCompleteControl) {
                            autoCompleteControl.replaceWithSelectedSearchText();
                            var lb = LinkBrowser.open({
                                panelKey: LinkBrowser.SEARCH_PANEL
                            });
                            lb.doSearch(lb.getLocationPresenter().getRawLinkText());
                        }
                    },
                    {
                        className: "dropdown-insert-link",
                        html: autoComplete.Util.dropdownLink("Insert web link", "dropdown-prevent-highlight", "editor-icon"),
                        callback: function (autoCompleteControl) {
                            autoCompleteControl.replaceWithSelectedSearchText();
                            LinkBrowser.open({
                                panelKey: LinkBrowser.WEBLINK_PANEL
                            });
                        }
                    }
                ];

                restSpecificAdditionLinksCallback && restSpecificAdditionLinksCallback(value, additionalLinks);

                return additionalLinks;
            },

            getDataAndRunCallback: function (autoCompleteControl, val, callback) {
                function getRestSpecificAdditionLinks(matrix, value, additionalLinks) {
                    function doesPageAlreadyExist() {
                        var pages = matrix[1];
                        var firstEntry = pages[0].restObj;

                        if (firstEntry.type === "page") {
                            return firstEntry.space.key == AJS.Meta.get('space-key') && firstEntry.title.toLowerCase() === value.toLowerCase();
                        }

                        return false;
                    }

                    if (value) {
                        if (matrix.length < 2 || !doesPageAlreadyExist()) {
                            additionalLinks.push({
                                className: "insert-create-page-link",
                                html: autoComplete.Util.dropdownLink("Insert link to create page", "dropdown-prevent-highlight", "editor-icon"),
                                callback: function (autoCompleteControl) {
                                    var title = Confluence.unescapeEntities(value);
                                    var link = Confluence.Link.createLinkToNewPage(title, AJS.Meta.get('space-key'));
                                    autoCompleteControl.update(link);
                                }
                            });
                        }
                    }
                }

                Confluence.Editor.Autocompleter.Util.getRestData(autoCompleteControl, getUrl, getParams, val, callback, "content", getRestSpecificAdditionLinks);
            },

            update: function (autoCompleteControl, link) {
                if (link.restObj) {
                    link = Confluence.Link.fromREST(link.restObj);
                }
                link.insert();
            }
        };

    }

    return AutocompleteSettingsLink;
});
/*
AJS.bind('init.rte', function () {
    'use strict';
    require('com.mesilat/editor').init();
});
*/
define('com.mesilat/crm-autocomplete-link', ['tinymce','confluence/legacy','com.mesilat/crm-autocomplete-settings-links'], function(tinymce,Confluence,CrmAutocompleteLink) {
    "use strict";

    return {
        init: function (ed) {
            var triggerKey = '#';
            ed.addCommand('cmeCrmAutocompleteLink', function () {
                Confluence.Editor.Autocompleter.Manager.shortcutFired(triggerKey);
            });
            console.log('CME', 'init');

            //ed.addShortcut("ctrl+shift+k", ed.getLang("AutoComplete"), "mceConfAutocompleteLink");
            CrmAutocompleteLink();
        },

        getInfo: function () {
            return {
                longname: 'CRM Auto Complete Link',
                author: 'Mesilat Limited',
                authorurl: 'http://www.mesilat.com',
                version: '0.1'
            };
        }
    };
});

require('confluence/module-exporter').safeRequire('com.mesilat/crm-autocomplete-link', function(CrmAutoCompleteLinkPlugin) {
    var tinymce = require('tinymce');
    tinymce.create('tinymce.plugins.CrmAutoCompleteLink', CrmAutoCompleteLinkPlugin);
    tinymce.PluginManager.add('crmautocompletelink', tinymce.plugins.CrmAutoCompleteLink);
});