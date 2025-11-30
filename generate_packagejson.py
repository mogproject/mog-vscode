#!/usr/bin/env python3

"""
Script to update package.json.
"""

import json

JSON_PATH = 'package.json'

EDIT = 'editorTextFocus'
EDIT_NON_WIDGET = f'{EDIT} && !suggestWidgetVisible'

settings = {
    # -----------------------------------------------------------------------------
    #  Cursor Movements
    # -----------------------------------------------------------------------------
    #
    # Up
    #
    'up': {'new': [('mog.cursorUp', EDIT_NON_WIDGET)]},
    'shift-up': {'new': [('mog.cursorUpSelect', EDIT_NON_WIDGET)]},
    'ctrl+p': {
        'new': [
            ('mog.cursorUp', EDIT_NON_WIDGET),
            ('editor.action.scrollUpHover', 'editorHoverFocused'),
            ('editor.action.selectPreviousStickyScrollLine', 'stickyScrollFocused'),
            ('focusPreviousRenameSuggestion', 'renameInputVisible'),
            ('history.showPrevious', 'historyNavigationBackwardsEnabled && historyNavigationWidgetFocus && !isComposing && !suggestWidgetVisible'),
            ('iconSelectBox.focusUp', 'iconSelectBoxFocus'),
            ('list.focusUp', 'listFocus && !inputFocus && !treestickyScrollFocused'),
            ('notifications.focusPreviousToast',
             'notificationFocus && notificationToastsVisible'),
            ('quickInput.previous', "inQuickInput && quickInputType == 'quickPick' || inQuickInput && quickInputType == 'quickTree'"),
            ('scm.viewPreviousCommit',
             'scmInputIsInFirstPosition && scmRepository && !suggestWidgetVisible'),
            ('selectPrevCodeAction', 'codeActionMenuVisible'),
            ('selectPrevSuggestion', 'suggestWidgetMultipleSuggestions && suggestWidgetVisible && textInputFocus || suggestWidgetVisible && textInputFocus && !suggestWidgetHasFocusedSuggestion'),
            ('showPrevParameterHint',
             'editorFocus && parameterHintsMultipleSignatures && parameterHintsVisible'),
            ('workbench.action.interactivePlayground.arrowUp',
             'interactivePlaygroundFocus && !editorTextFocus'),
            ('workbench.action.terminal.hideSuggestWidgetAndNavigateHistory', 'config.terminal.integrated.suggest.upArrowNavigatesHistory && terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible && !simpleSuggestWidgetHasNavigated || config.terminal.integrated.suggest.upArrowNavigatesHistory && terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible && !simpleSuggestWidgetHasNavigated'),
            ('workbench.action.terminal.selectPrevSuggestion', 'simpleSuggestWidgetHasNavigated && terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible || simpleSuggestWidgetHasNavigated && terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible || terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible && !config.terminal.integrated.suggest.upArrowNavigatesHistory || terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible && !config.terminal.integrated.suggest.upArrowNavigatesHistory'),
            ('workbench.banner.focusPreviousAction', 'bannerFocused'),
            ('workbench.statusBar.focusPrevious', 'statusBarFocused'),
        ]
    },
    #
    # Down
    #
    'down': {'new': [('mog.cursorDown', EDIT_NON_WIDGET)]},
    'shift+down': {'new': [('mog.cursorDownSelect', EDIT_NON_WIDGET)]},
    'ctrl+n': {
        # disable default keybind
        'old': [('workbench.action.files.newUntitledFile', '')],
        'new': [
            ('mog.cursorDown', EDIT_NON_WIDGET),
            ('editor.action.scrollDownHover', 'editorHoverFocused'),
            ('breadcrumbs.selectFocused', 'breadcrumbsActive && breadcrumbsVisible'),
            ('editor.action.selectNextStickyScrollLine', 'stickyScrollFocused'),
            ('focusNextRenameSuggestion', 'renameInputVisible'),
            ('history.showNext', 'historyNavigationForwardsEnabled && historyNavigationWidgetFocus && !isComposing && !suggestWidgetVisible'),
            ('iconSelectBox.focusDown', 'iconSelectBoxFocus'),
            ('interactive.history.next', "isCompositeNotebook && !notebookEditorFocused && !suggestWidgetVisible && interactiveInputCursorAtBoundary != 'none' && interactiveInputCursorAtBoundary != 'top'"),
            ('list.focusDown', 'listFocus && !inputFocus && !treestickyScrollFocused'),
            ('notifications.focusNextToast',
             'notificationFocus && notificationToastsVisible'),
            ('quickInput.next', "inQuickInput && quickInputType == 'quickPick' || inQuickInput && quickInputType == 'quickTree'"),
            ('scm.viewNextCommit',
             'scmInputIsInLastPosition && scmRepository && !suggestWidgetVisible'),
            ('selectNextCodeAction', 'codeActionMenuVisible'),
            ('selectNextSuggestion', 'suggestWidgetMultipleSuggestions && suggestWidgetVisible && textInputFocus || suggestWidgetVisible && textInputFocus && !suggestWidgetHasFocusedSuggestion'),
            ('settings.action.focusSettingsFile',
             'inSettingsSearch && !suggestWidgetVisible'),
            ('settings.action.focusSettingsFromSearch',
             'inSettingsSearch && !suggestWidgetVisible'),
            ('showNextParameterHint',
             'editorFocus && parameterHintsMultipleSignatures && parameterHintsVisible'),
            ('workbench.action.interactivePlayground.arrowDown',
             'interactivePlaygroundFocus && !editorTextFocus'),
            ('workbench.action.terminal.selectNextSuggestion',
             'terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible || terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible'),
            ('workbench.banner.focusNextAction', 'bannerFocused'),
            ('workbench.statusBar.focusNext', 'statusBarFocused'),
        ],
    },
    #
    # Left
    #
    'left': {'new': [('mog.cursorLeft', 'editorTextFocus')]},
    'shift+left': {'new': [('mog.cursorLeftSelect', 'editorTextFocus')]},
    'ctrl+b': {
        'old': [('workbench.action.toggleSidebarVisibility', '')],
        'new': [
            ('mog.cursorLeft', 'editorTextFocus'),
            ('editor.action.scrollLeftHover', 'editorHoverFocused'),
            ('breadcrumbs.focusPrevious', 'breadcrumbsActive && breadcrumbsVisible'),
            ('iconSelectBox.focusPrevious',
             'iconSelectBoxFocus && iconSelectBoxInputEmpty || iconSelectBoxFocus && !iconSelectBoxInputFocus'),
            ('workbench.banner.focusPreviousAction', 'bannerFocused'),
            ('workbench.statusBar.focusPrevious', 'statusBarFocused'),
        ],
    },
    #
    # Right
    #
    'right': {'new': [('mog.cursorRight', 'editorTextFocus')]},
    'shift+right': {'new': [('mog.cursorRightSelect', 'editorTextFocus')]},
    'ctrl+f': {
        'old': [
            ('actions.find', ''),
            # FIXME: add more if needed
        ],
        'new': [
            ('mog.cursorRight', 'editorTextFocus'),
            ('editor.action.scrollRightHover', 'editorHoverFocused'),
            ('breadcrumbs.focusNext', 'breadcrumbsActive && breadcrumbsVisible'),
            ('iconSelectBox.focusNext',
             'iconSelectBoxFocus && iconSelectBoxInputEmpty || iconSelectBoxFocus && !iconSelectBoxInputFocus'),
            ('workbench.banner.focusNextAction', 'bannerFocused'),
            ('workbench.statusBar.focusNext', 'statusBarFocused'),
        ],
    },
    #
    # Home
    #
    'home': {'new': [('mog.cursorHome', 'editorTextFocus')]},
    'shift+home': {'new': [('mog.cursorHomeSelect', 'editorTextFocus')]},
    'ctrl+a': {
        'new': [('mog.cursorHome', 'editorTextFocus')],
    },
    #
    # End
    #
    'home': {'new': [('mog.cursorEnd', 'editorTextFocus')]},
    'shift+end': {'new': [('mog.cursorEndSelect', 'editorTextFocus')]},
    'ctrl+e': {
        'old': [('workbench.action.quickOpen', '')],
        'new': [('mog.cursorEnd', 'editorTextFocus')],
    },
    #
    # Word Left/Right
    #
    'alt-b': {'new': [('mog.cursorWordLeft', 'editorTextFocus')]},
    'alt-f': {'new': [('mog.cursorWordRight', 'editorTextFocus')]},
    #
    # PageDown
    #
    'pagedown': {'new': [('mog.cursorPageDown', EDIT_NON_WIDGET)]},
    'shift+pagedown': {'new': [('mog.cursorPageDownSelect', EDIT_NON_WIDGET)]},
    'ctrl+v': {
        'new': [
            ('mog.cursorPageDown', EDIT_NON_WIDGET),
            ('editor.action.pageDownHover', 'editorHoverFocused'),
            ('list.focusPageDown', 'listFocus && !inputFocus && !treestickyScrollFocused'),
            ('notifications.focusLastToast',
             'notificationFocus && notificationToastsVisible'),
            ('quickInput.pageNext', "inQuickInput && quickInputType == 'quickPick' || inQuickInput && quickInputType == 'quickTree'"),
            ('selectNextPageSuggestion', 'suggestWidgetMultipleSuggestions && suggestWidgetVisible && textInputFocus || suggestWidgetVisible && textInputFocus && !suggestWidgetHasFocusedSuggestion'),
            ('workbench.action.interactivePlayground.pageDown',
             'interactivePlaygroundFocus && !editorTextFocus'),
            ('workbench.action.terminal.selectNextPageSuggestion',
             'terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible || terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible'),
        ]
    },
    #
    # PageUp
    #
    'pageup': {'new': [('mog.cursorPageUp', EDIT_NON_WIDGET)]},
    'shift+pageup': {'new': [('mog.cursorPageUpSelect', EDIT_NON_WIDGET)]},
    'alt+v': {
        'new': [
            ('mog.cursorPageUp', EDIT_NON_WIDGET),
            ('editor.action.pageUpHover', 'editorHoverFocused'),
            ('list.focusPageUp', 'listFocus && !inputFocus && !treestickyScrollFocused'),
            ('notifications.focusFirstToast',
             'notificationFocus && notificationToastsVisible'),
            ('quickInput.pagePrevious',
             "inQuickInput && quickInputType == 'quickPick' || inQuickInput && quickInputType == 'quickTree'"),
            ('selectPrevPageSuggestion', 'suggestWidgetMultipleSuggestions && suggestWidgetVisible && textInputFocus || suggestWidgetVisible && textInputFocus && !suggestWidgetHasFocusedSuggestion'),
            ('workbench.action.interactivePlayground.pageUp',
             'interactivePlaygroundFocus && !editorTextFocus'),
            ('workbench.action.terminal.selectPrevPageSuggestion',
             'terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible || terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible'),
        ]
    },
    #
    # Top
    #
    'ctrl+home': {'new': [('mog.cursorTop', EDIT_NON_WIDGET)]},
    'ctrl+shift+home': {'new': [('mog.cursorTopSelect', EDIT_NON_WIDGET)]},
    'alt+shift+,': {
        'new': [
            ('mog.cursorTop', EDIT_NON_WIDGET),
            ('workbench.action.terminal.scrollToTopAccessibleView',
             "accessibleViewIsShown && terminalHasBeenCreated && accessibleViewCurrentProviderId == 'terminal' || accessibleViewIsShown && terminalProcessSupported && accessibleViewCurrentProviderId == 'terminal'"),
            ('workbench.action.terminal.scrollToTop',
             'terminalFocusInAny && terminalHasBeenCreated && !terminalAltBufferActive || terminalFocusInAny && terminalProcessSupported && !terminalAltBufferActive'),
            ('interactive.scrollToTop',
             "activeEditor == 'workbench.editor.interactive'"),
            ('quickInput.first', "inQuickInput && quickInputType == 'quickPick' || inQuickInput && quickInputType == 'quickTree'"),
        ]
    },
    #
    # Bottom
    #
    'ctrl+end': {'new': [('mog.cursorBottom', EDIT_NON_WIDGET)]},
    'ctrl+shift+end': {'new': [('mog.cursorBottom', EDIT_NON_WIDGET)]},
    'alt+shift+.': {
        'new': [
            ('mog.cursorBottom', EDIT_NON_WIDGET),
            ('workbench.action.terminal.scrollToBottomAccessibleView',
             "accessibleViewIsShown && terminalHasBeenCreated && accessibleViewCurrentProviderId == 'terminal' || accessibleViewIsShown && terminalProcessSupported && accessibleViewCurrentProviderId == 'terminal'"),
            ('workbench.action.terminal.scrollToBottom',
             'terminalFocusInAny && terminalHasBeenCreated && !terminalAltBufferActive || terminalFocusInAny && terminalProcessSupported && !terminalAltBufferActive'),
            ('interactive.scrollToBottom',
             "activeEditor == 'workbench.editor.interactive'"),
            ('quickInput.last', "inQuickInput && quickInputType == 'quickPick' || inQuickInput && quickInputType == 'quickTree'"),
        ]
    },

    # -----------------------------------------------------------------------------
    #  Deletion
    # -----------------------------------------------------------------------------
    'ctrl+d': {'new': [('deleteRight', 'textInputFocus')]},
    'alt+d': {'new': [('deleteWordEndRight', 'textInputFocus')]},
    'ctrl+h': {'new': [('deleteLeft', 'textInputFocus')]},

    # -----------------------------------------------------------------------------
    #  Tab
    # -----------------------------------------------------------------------------
    'ctrl+i': {
        'new': [
            ('tab', 'textInputFocus'),
            ('editor.action.inlineSuggest.commit', 'inlineEditIsVisible && tabShouldAcceptInlineEdit && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible || inlineEditIsVisible && inlineSuggestionVisible && tabShouldAcceptInlineEdit && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible || inlineSuggestionHasIndentationLessThanTabSize && inlineSuggestionVisible && !editor.hasSelection && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible || inlineEditIsVisible && inlineSuggestionHasIndentationLessThanTabSize && inlineSuggestionVisible && !editor.hasSelection && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible'),
            ('editor.action.inlineSuggest.commit', 'inInlineEditsPreviewEditor'),
            ('editor.emmet.action.expandAbbreviation',
             'config.emmet.triggerExpansionOnTab && editorTextFocus && !editorReadonly && !editorTabMovesFocus'),
            ('editor.action.inlineSuggest.jump',
             'inlineEditIsVisible && tabShouldJumpToInlineEdit && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible'),
            ('acceptSelectedSuggestion',
             'suggestWidgetHasFocusedSuggestion && suggestWidgetVisible && textInputFocus'),
            ('insertBestCompletion', "atEndOfWord && textInputFocus && !hasOtherSuggestions && !inSnippetMode && !suggestWidgetVisible && config.editor.tabCompletion == 'on'"),
            ('insertNextSuggestion', "hasOtherSuggestions && textInputFocus && !inSnippetMode && !suggestWidgetVisible && config.editor.tabCompletion == 'on'"),
            ('insertSnippet', 'editorTextFocus && hasSnippetCompletions && !editorTabMovesFocus && !inSnippetMode'),
            ('jumpToNextSnippetPlaceholder',
             'hasNextTabstop && inSnippetMode && textInputFocus'),
            ('workbench.action.terminal.acceptSelectedSuggestion', 'simpleSuggestWidgetHasFocusedSuggestion && terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible || simpleSuggestWidgetHasFocusedSuggestion && terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible'),
        ]
    },

    # -----------------------------------------------------------------------------
    #  Escape
    # -----------------------------------------------------------------------------
    'ctrl+g': {
        'old': [('workbench.action.gotoLine', '')],
        'new': [
            ('editor.action.inlineSuggest.hide', 'inInlineEditsPreviewEditor'),
            ('editor.action.inlineSuggest.hide',
             'inlineEditIsVisible || inlineSuggestionVisible'),
            ('editor.action.hideColorPicker', 'standaloneColorPickerVisible'),
            ('inlineChat2.close', "chatInputHasFocus && inlineChatHasEditsAgent && inlineChatVisible && activeEditor != 'workbench.editor.notebook' || chatInputHasFocus && inlineChatHasNotebookAgent && inlineChatVisible && activeEditor == 'workbench.editor.notebook' || editorFocus && inlineChatHasEditsAgent && inlineChatVisible && !chatEdits.hasEditorModifications && activeEditor != 'workbench.editor.notebook' || editorFocus && inlineChatHasNotebookAgent && inlineChatVisible && !chatEdits.hasEditorModifications && activeEditor == 'workbench.editor.notebook'"),
            ('workbench.action.terminal.chat.close',
             'chatIsEnabled && terminalChatFocus && terminalChatVisible || chatIsEnabled && terminalChatVisible && terminalFocus'),
            ('notifications.hideList', 'notificationCenterVisible'),
            ('search.action.focusQueryEditorWidget', 'inSearchEditor'),
            ('search.action.cancel',
             "listFocus && searchViewletVisible && !inputFocus && !treestickyScrollFocused && searchState != '0'"),
            ('inlayHints.stopReadingLineWithHint', 'isReadingLineWithInlayHints'),
            ('workbench.action.terminal.clearSelection',
             'terminalFocusInAny && terminalHasBeenCreated && terminalTextSelected && !terminalFindVisible || terminalFocusInAny && terminalProcessSupported && terminalTextSelected && !terminalFindVisible'),
            ('workbench.action.terminal.hideFind',
             'terminalFindVisible && terminalFocusInAny && terminalHasBeenCreated || terminalFindVisible && terminalFocusInAny && terminalProcessSupported'),
            ('workbench.action.terminal.stopVoice', 'terminalDictationInProgress'),
            ('workbench.action.editorDictation.stop', 'editorDictation.inProgress'),
            ('welcome.goBack', "inWelcome && activeEditor == 'gettingStartedPage'"),
            ('breadcrumbs.selectEditor', 'breadcrumbsActive && breadcrumbsVisible'),
            ('cancelLinkedEditingInput',
             'LinkedEditingInputVisible && editorTextFocus'),
            ('cancelRenameInput', 'editorFocus && renameInputVisible'),
            ('cancelSelection', 'editorHasSelection && textInputFocus'),
            ('chat.models.action.clearSearchResults',
             'inModelsEditor && inModelsSearch'),
            ('closeBreakpointWidget', 'breakpointWidgetVisible && textInputFocus'),
            ('closeFindWidget', 'editorFocus && findWidgetVisible && !isComposing'),
            ('closeMarkersNavigation', 'editorFocus && markersNavigationVisible'),
            ('closeParameterHints', 'editorFocus && parameterHintsVisible'),
            ('closeQuickDiff', 'dirtyDiffVisible'),
            ('closeReferenceSearch',
             'inReferenceSearchEditor && !config.editor.stablePeek'),
            ('closeReferenceSearch', 'editorTextFocus && referenceSearchVisible && !config.editor.stablePeek || referenceSearchVisible && !config.editor.stablePeek && !inputFocus'),
            ('closeReplaceInFilesWidget',
             'replaceInputBoxFocus && searchViewletVisible'),
            ('commentsClearFilterText', 'commentsFilterFocus'),
            ('diffEditor.exitCompareMove', 'comparingMovedCode'),
            ('editor.action.selectEditor', 'stickyScrollFocused'),
            ('editor.action.webvieweditor.hideFind',
             "webviewFindWidgetVisible && !editorFocus && activeEditor == 'WebviewEditor'"),
            ('editor.cancelOperation', 'cancellableOperation'),
            ('editor.closeCallHierarchy',
             'callHierarchyVisible && !config.editor.stablePeek'),
            ('editor.closeTestPeek', 'testing.isInPeek && !config.editor.stablePeek || testing.isPeekVisible && !config.editor.stablePeek'),
            ('editor.closeTypeHierarchy',
             'typeHierarchyVisible && !config.editor.stablePeek'),
            ('editor.gotoNextSymbolFromResult.cancel', 'hasSymbols'),
            ('editor.hideDropWidget', 'dropWidgetVisible'),
            ('editor.hidePasteWidget', 'pasteWidgetVisible'),
            ('filesExplorer.cancelCut',
             'explorerResourceCut && filesExplorerFocus && foldersViewVisible && !inputFocus'),
            ('hideCodeActionWidget', 'codeActionMenuVisible'),
            ('hideSuggestWidget', 'suggestWidgetVisible && textInputFocus'),
            ('inlineChat.close', "inlineChatHasNotebookInline && inlineChatVisible && activeEditor == 'workbench.editor.notebook' || inlineChatHasProvider && inlineChatVisible && activeEditor != 'workbench.editor.notebook'"),
            ('inlineChat.discardHunkChange', "inlineChatHasNotebookInline && inlineChatVisible && activeEditor == 'workbench.editor.notebook' && inlineChatResponseType == 'messagesAndEdits' || inlineChatHasProvider && inlineChatVisible && inlineChatResponseType == 'messagesAndEdits' && activeEditor != 'workbench.editor.notebook'"),
            ('inlineChat.hideHint', 'inlineChatShowingHint'),
            ('keybindings.editor.clearSearchResults',
             'inKeybindings && inKeybindingsSearch'),
            ('keybindings.editor.rejectWhenExpression',
             'inKeybindings && whenFocus && !suggestWidgetVisible'),
            ('leaveEditorMessage', 'messageVisible'),
            ('leaveSnippet', 'inSnippetMode && textInputFocus'),
            ('list.clear', 'listFocus && listHasSelectionOrFocus && !inputFocus && !treestickyScrollFocused'),
            ('list.closeFind', 'listFocus && treeFindOpen'),
            ('notifications.hideToasts', 'notificationToastsVisible'),
            ('notifications.hideToasts',
             'notificationFocus && notificationToastsVisible'),
            ('problems.action.clearFilterText', 'problemsFilterFocus'),
            ('quickInput.hide', 'inQuickInput'),
            ('removeSecondaryCursors', 'editorHasMultipleSelections && textInputFocus'),
            ('scm.clearInput',
             'scmRepository && !editorHasSelection && !suggestWidgetVisible'),
            ('workbench.action.chat.stopReadChatItemAloud',
             'scopedChatSynthesisInProgress'),
            ('workbench.action.closeQuickOpen', 'inQuickOpen'),
            ('workbench.action.hideComment',
             'commentEditorFocused || commentFocused'),
            ('workbench.action.terminal.hideSuggestWidget',
             'terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible || terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible'),
            ('workbench.actions.workbench.panel.output.clearFilterText',
             'outputFilterFocus'),
            ('workbench.banner.focusBanner', 'bannerFocused'),
            ('workbench.edit.chat.cancel', 'chatSessionCurrentlyEditing && inChatInput && !editorHasMultipleSelections && !editorHasSelection && !editorHoverVisible || chatSessionCurrentlyEditingInput && inChatInput && !editorHasMultipleSelections && !editorHasSelection && !editorHoverVisible'),
            ('workbench.statusBar.clearFocus', 'statusBarFocused'),
        ]
    },

    # -----------------------------------------------------------------------------
    #  Undo/Redo
    # -----------------------------------------------------------------------------
    'ctrl+/': {
        'old': [('editor.action.commentLine', 'editorTextFocus && !editorReadonly')],
        'new': [('undo', 'editorTextFocus')],
    },
    'ctrl+\\': {
        'old': [('workbench.action.splitEditor', '')],
        'new': [('redo', 'editorTextFocus')],
    },

    # -----------------------------------------------------------------------------
    #  Search
    # -----------------------------------------------------------------------------
    'ctrl+s': {
        'new': [
            ('actions.find', '!findWidgetVisible'),
            ('editor.action.nextMatchFindAction', 'findWidgetVisible'),
        ]
    },
    'ctrl+r': {
        'new': [
            ('actions.find', '!findWidgetVisible'),
            ('editor.action.previousMatchFindAction', 'findWidgetVisible'),
        ]
    },

    # -----------------------------------------------------------------------------
    #  Enter
    # -----------------------------------------------------------------------------
    'ctrl+m': {
        'new': [
            ('repl.action.acceptInput', 'inDebugRepl && textInputFocus'),
            ('acceptRenameInput', 'editorFocus && renameInputVisible && !isComposing'),
            ('acceptSelectedCodeAction', 'codeActionMenuVisible'),
            ('acceptSelectedSuggestion', 'acceptSuggestionOnEnter && suggestWidgetHasFocusedSuggestion && suggestWidgetVisible && suggestionMakesTextEdit && textInputFocus'),
            ('breadcrumbs.selectFocused', 'breadcrumbsActive && breadcrumbsVisible'),
            ('breakpointWidget.action.acceptInput',
             'breakpointWidgetVisible && inBreakpointWidget'),
            ('editor.action.goToFocusedStickyScrollLine', 'stickyScrollFocused'),
            ('editor.action.replaceOne',
             'editorFocus && findWidgetVisible && replaceInputFocussed'),
            ('explorer.openAndPassFocus',
             'filesExplorerFocus && foldersViewVisible && !explorerResourceIsFolder && !inputFocus'),
            ('iconSelectBox.selectFocused', 'iconSelectBoxFocus'),
            ('interactive.execute', "isCompositeNotebook && !config.interactiveWindow.executeWithShiftEnter && activeEditor == 'workbench.editor.interactive'"),
            ('list.select', 'listFocus && !inputFocus && !treestickyScrollFocused'),
            ('list.stickyScrollselect', 'treestickyScrollFocused'),
            ('quickInput.accept',
             "inQuickInput && !isComposing && quickInputType != 'quickWidget'"),
            ('repl.execute', "isCompositeNotebook && !config.interactiveWindow.executeWithShiftEnter && !notebookCellListFocused && activeEditor == 'workbench.editor.repl'"),
            ('search.action.openResult',
             'fileMatchOrMatchFocus && searchViewletVisible'),
            ('workbench.action.chat.submit',
             'chatInputHasText && inChatInput && !chatSessionRequestInProgress && !withinEditSessionDiff'),
            ('workbench.action.terminal.acceptSelectedSuggestion', "simpleSuggestWidgetHasFocusedSuggestion && simpleSuggestWidgetHasNavigated && terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible || simpleSuggestWidgetHasFocusedSuggestion && simpleSuggestWidgetHasNavigated && terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible || simpleSuggestWidgetHasFocusedSuggestion && terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible && !simpleSuggestWidgetFirstSuggestionFocused || simpleSuggestWidgetHasFocusedSuggestion && terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible && config.terminal.integrated.suggest.selectionMode != 'partial' || simpleSuggestWidgetHasFocusedSuggestion && terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible && !simpleSuggestWidgetFirstSuggestionFocused || simpleSuggestWidgetHasFocusedSuggestion && terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible && config.terminal.integrated.suggest.selectionMode != 'partial'"),
            ('workbench.action.terminal.acceptSelectedSuggestionEnter', "terminalFocus && terminalHasBeenCreated && terminalIsOpen && terminalSuggestWidgetVisible && config.terminal.integrated.suggest.runOnEnter != 'never' || terminalFocus && terminalIsOpen && terminalProcessSupported && terminalSuggestWidgetVisible && config.terminal.integrated.suggest.runOnEnter != 'never'"),
        ]
    },

    # -----------------------------------------------------------------------------
    #  Copy/Paste
    # -----------------------------------------------------------------------------
    'ctrl+k': {  # kill & yank line
        'new': [('mog.editor.action.killLineAction', EDIT_NON_WIDGET)],
    },
    'ctrl+w': {  # cut selected
        'new': [('mog.editor.action.clipboardCutAction', EDIT)],
    },
    'alt+w': {  # copy selected
        'new': [('mog.editor.action.clipboardCopyAction', EDIT)],
    },
    'ctrl+y': {  # yank
        'old': [('redo', '')],
        'new': [('editor.action.clipboardPasteAction', EDIT)],
    },

    # -----------------------------------------------------------------------------
    #  Comment/Duplicate
    # -----------------------------------------------------------------------------
    'alt+/': {
        'new': [('editor.action.commentLine', EDIT)]
    },
    'ctrl+shift+/': {  # comment line and move to next line
        'new': [('mog.editor.action.commentLine', EDIT)]
    },
    'ctrl+shift+d': {
        'new': [('mog.editor.action.duplicateAction', EDIT)]
    },
    'ctrl+shift+c': {
        'new': [('mog.editor.action.duplicateAndCommentLine', EDIT)]
    },

    # -----------------------------------------------------------------------------
    #  Suggest
    # -----------------------------------------------------------------------------
    'alt+j': {'new': [('editor.action.triggerSuggest', EDIT)]},

    # -----------------------------------------------------------------------------
    #  Format
    # -----------------------------------------------------------------------------
    'ctrl+l': {
        'new': [('mog.editor.action.format', EDIT)],
    },

    # -----------------------------------------------------------------------------
    #  Add Cursors
    # -----------------------------------------------------------------------------
    # add cursor below
    'ctrl+alt+n': {'new': [('editor.action.insertCursorBelow', EDIT)]},
    # add cursor above
    'ctrl+alt+p': {'new': [('editor.action.insertCursorAbove', EDIT)]},

    # -----------------------------------------------------------------------------
    #  Vim-style Selection
    # -----------------------------------------------------------------------------
    'ctrl+space': {'new': [('mog.editor.action.enterMarkMode', EDIT)]},
    'escape': {'new': [('mog.editor.action.exitMarkMode', EDIT_NON_WIDGET)]},
    'ctrl+x h': {'new': [('editor.action.selectAll', EDIT)]},
    'ctrl+x r': {'new': [('mog.editor.action.selectRectangle', EDIT)]},

    # -----------------------------------------------------------------------------
    #  Editor Management
    # -----------------------------------------------------------------------------
    'ctrl+x n': {'new': [('workbench.action.nextEditor', EDIT)]},
    'ctrl+x p': {'new': [('workbench.action.previousEditor', EDIT)]},
    'ctrl+x o': {'new': [('workbench.action.focusNextGroup', EDIT)]},
    'ctrl+x k': {'new': [('workbench.action.closeActiveEditor', EDIT)]},
    'ctrl+x ctrl+c': {'new': [('workbench.action.closeOtherEditors', EDIT)]},
    'ctrl+x ctrl+s': {'new': [('workbench.action.files.save', EDIT)]},
    'ctrl+x s': {'new': [('workbench.action.files.saveAll', EDIT)]},

    # -----------------------------------------------------------------------------
    #  Replaced Key Bindings
    # -----------------------------------------------------------------------------
    'alt+g g': {'new': [('workbench.action.gotoLine', '')]},

    # -----------------------------------------------------------------------------
    #  Disable Annoying Shortcuts
    # -----------------------------------------------------------------------------
    'ctrl+shift+i': {'old': [('workbench.action.chat.openagent', 'config.chat.agent.enabled && !chatSetupDisabled && !chatSetupHidden')]}
}

# Key bindings
keybindings = []
for k, v in settings.items():
    if 'new' in v:
        keybindings += [{
            'key': k,
            'command': xs[0]
        } | ({} if not xs[1] else {'when': xs[1]}) for xs in v['new']]
    if 'old' in v:
        keybindings += [{
            'key': k,
            'command': '-' + xs[0]  # remove existing keybind
        } | ({} if not xs[1] else {'when': xs[1]}) for xs in v['old']]

# Typing enter
keybindings += [{
    'key': 'ctrl+m',
    'command': 'type',
    'args': {'text': '\n'},
    'when': EDIT
}]

# Make changes
with open(JSON_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['contributes']['keybindings'] = keybindings

# Save changes
with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Updated: {JSON_PATH}')
