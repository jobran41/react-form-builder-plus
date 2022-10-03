import React from "react";
import TextAreaAutosize from "react-textarea-autosize";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";

import DynamicOptionList from "./dynamic-option-list";
import { get } from "./stores/requests";
import ID from "./UUID";

const toolbar = {
  options: ["inline", "list", "textAlign", "fontSize", "link", "history"],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ["bold", "italic", "underline", "superscript", "subscript"],
  },
};

export default class FormElementsEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
    };
  }

  toggleRequired() {
    // const this_element = this.state.element;
  }

  editElementProp(elemProperty, targProperty, e) {
    // elemProperty could be content or label
    // targProperty could be value or checked
    const this_element = this.state.element;
    this_element[elemProperty] = e.target[targProperty];

    this.setState(
      {
        element: this_element,
        dirty: true,
      },
      () => {
        if (targProperty === "checked") {
          this.updateElement();
        }
      }
    );
  }

  onEditorStateChange(index, property, editorContent) {
    // const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');

    const this_element = this.state.element;
    if (property === "text") {
      this_element[property] = editorContent.target.value;
      this.setState({
        element: this_element,
        dirty: true,
      });
    } else if (property === "customColumn") {
      this_element[property] = editorContent;
      this_element.childItems = editorContent.map(() => null);
      this.setState({
        element: this_element,
        dirty: true,
      });
    } else if (property === "childItems") {
      this_element[property] = editorContent;
      this.setState({
        element: this_element,
        dirty: true,
      });
    } else if (
      property === "childNames" ||
      property === "childNamesRows" ||
      property === "childNamesColumn"
    ) {
      if (property === "childNamesRows") {
        this_element.childNames = [
          ...Array(Number(editorContent.target.value)).fill(null),
        ];
      }
      if (property === "childNamesColumn") {
        this_element.customColumn = [
          ...Array(Number(editorContent.target.value)).fill(12),
        ];
      }

      if (property === "childNames") {
        this_element[property][index] = editorContent.target.value;
      }

      const arr2d = Array(this_element?.childNames.length)
        .fill(null)
        .map(() => Array(this_element?.customColumn ? this_element?.customColumn.length : this_element?.childNames.length).fill(null));

      this_element.childItems = arr2d;

      this.setState({
        element: this_element,
        dirty: true,
      });
    } else {
      const html = draftToHtml(convertToRaw(editorContent.getCurrentContent()))
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/(?:\r\n|\r|\n)/g, " ");

      this_element[property] = html;
      this.setState({
        element: this_element,
        dirty: true,
      });
    }
  }

  updateElement() {
    const this_element = this.state.element;
    // to prevent ajax calls with no change
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element);
      this.setState({ dirty: false });
    }
  }

  convertFromHTML(content) {
    const newContent = convertFromHTML(content);
    if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
      // to prevent crash when no contents in editor
      return EditorState.createEmpty();
    }
    const contentState = ContentState.createFromBlockArray(newContent);
    return EditorState.createWithContent(contentState);
  }

  addOptions() {
    const optionsApiUrl = document.getElementById("optionsApiUrl").value;
    if (optionsApiUrl) {
      get(optionsApiUrl).then((data) => {
        this.props.element.options = [];
        const { options } = this.props.element;
        data.forEach((x) => {
          // eslint-disable-next-line no-param-reassign
          x.key = ID.uuid();
          options.push(x);
        });
        const this_element = this.state.element;
        this.setState({
          element: this_element,
          dirty: true,
        });
      });
    }
  }

  handleChangeGrid(property, val, index) {
    const this_element = this.state.element;
    if (!this_element[property]) {
      this_element[property] = [];
    }
    this_element[property][index] = val;

    /*     parentId: "563356F5-1A1E-4ED2-BB88-A10E01CE9E8E"
    parentIndex: 0
    col: 0 */

    this.setState({
      element: this_element,
      dirty: true,
    });
    this.props.updateElementMove({ elm: this_element, val, index });
  }

  render() {
    if (this.state.dirty) {
      this.props.element.dirty = true;
    }

    const this_checked = this.props.element.hasOwnProperty("required")
      ? this.props.element.required
      : false;
    const this_read_only = this.props.element.hasOwnProperty("readOnly")
      ? this.props.element.readOnly
      : false;
    const this_default_today = this.props.element.hasOwnProperty("defaultToday")
      ? this.props.element.defaultToday
      : false;
    const this_show_time_select = this.props.element.hasOwnProperty(
      "showTimeSelect"
    )
      ? this.props.element.showTimeSelect
      : false;
    const this_show_time_select_only = this.props.element.hasOwnProperty(
      "showTimeSelectOnly"
    )
      ? this.props.element.showTimeSelectOnly
      : false;
    const this_checked_inline = this.props.element.hasOwnProperty("inline")
      ? this.props.element.inline
      : false;
    const this_checked_bold = this.props.element.hasOwnProperty("bold")
      ? this.props.element.bold
      : false;
    const this_checked_italic = this.props.element.hasOwnProperty("italic")
      ? this.props.element.italic
      : false;
    const this_checked_center = this.props.element.hasOwnProperty("center")
      ? this.props.element.center
      : false;
    const this_checked_page_break = this.props.element.hasOwnProperty(
      "pageBreakBefore"
    )
      ? this.props.element.pageBreakBefore
      : false;
    const this_checked_alternate_form = this.props.element.hasOwnProperty(
      "alternateForm"
    )
      ? this.props.element.alternateForm
      : false;

    const {
      canHavePageBreakBefore,
      canHaveAlternateForm,
      canHaveDisplayHorizontal,
      canHaveOptionCorrect,
      canHaveOptionValue,
    } = this.props.element;

    const this_files = this.props.files.length ? this.props.files : [];
    if (
      this_files.length < 1 ||
      (this_files.length > 0 && this_files[0].id !== "")
    ) {
      this_files.unshift({ id: "", file_name: "" });
    }

    let editorState;
    if (this.props.element.hasOwnProperty("content")) {
      editorState = this.convertFromHTML(this.props.element.content);
    }
    if (this.props.element.hasOwnProperty("label")) {
      editorState = this.convertFromHTML(this.props.element.label);
    }

    return (
      <div>
        <div className="clearfix">
          <h4 className="float-left">
            {this.props.element.text}
            <input
              id="labelName"
              type="text"
              className="form-control"
              defaultValue={this.props.element.text}
              onChange={this.onEditorStateChange.bind(this, 0, "text")}
            />
          </h4>
          <i
            className="float-right fas fa-times dismiss-edit"
            onClick={this.props.manualEditModeOff}
          ></i>
        </div>

        {(this.state.element.childNames && !this.state.element.type) && (
          <>
            <label>Rows</label>
            <input
              id="labelName"
              type="text"
              className="form-control"
              defaultValue={Number(this.props.element?.childNames?.length)}
              onChange={this.onEditorStateChange.bind(
                this,
                "i",
                "childNamesRows"
              )}
            />
            <label>Column</label>
            <input
              id="labelName"
              type="text"
              className="form-control"
              defaultValue={Number(this.props.element?.customColumn?.length)}
              onChange={this.onEditorStateChange.bind(
                this,
                "i",
                "childNamesColumn"
              )}
            />
          </>
        )}
        {this.state.element.type &&
        <div>
          <div>
              <label>Accordion Name </label>
              <input
                id="labelName"
                type="text"
                className="form-control"
                defaultValue={this.state.element.childNames && this.state.element.childNames[0]}
                onChange={this.onEditorStateChange.bind(this, 0, "childNames")}
              />
            </div>
          <label>Rows</label>
            <input
              id="labelName"
              type="text"
              className="form-control"
              defaultValue={Number(this.props.element?.childNames?.length)}
              onChange={this.onEditorStateChange.bind(
                this,
                "i",
                "childNamesRows"
              )}
            />

          </div>}
        {(this.state.element.childNames && !this.state.element.type) &&
          this.state.element.childNames.map((el, i) => (
            <div>
              <label>Tabs {i}</label>
              <input
                id="labelName"
                type="text"
                className="form-control"
                defaultValue={el}
                onChange={this.onEditorStateChange.bind(this, i, "childNames")}
              />
            </div>
          ))}
        {this.props.element.hasOwnProperty("content") && (
          <div className="form-group">
            <label className="control-label">Text to display:</label>

            <Editor
              toolbar={toolbar}
              defaultEditorState={editorState}
              onBlur={this.updateElement.bind(this)}
              onEditorStateChange={this.onEditorStateChange.bind(
                this,
                0,
                "content"
              )}
              stripPastedStyles={true}
            />
          </div>
        )}
        {this.props.element.hasOwnProperty("file_path") && (
          <div className="form-group">
            <label className="control-label" htmlFor="fileSelect">
              Choose file:
            </label>
            <select
              id="fileSelect"
              className="form-control"
              defaultValue={this.props.element.file_path}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, "file_path", "value")}
            >
              {this_files.map((file) => {
                const this_key = `file_${file.id}`;
                return (
                  <option value={file.id} key={this_key}>
                    {file.file_name}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        {this.props.element.hasOwnProperty("href") && (
          <div className="form-group">
            <TextAreaAutosize
              type="text"
              className="form-control"
              defaultValue={this.props.element.href}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, "href", "value")}
            />
          </div>
        )}
        {this.props.element.hasOwnProperty("src") && (
          <div>
            <div className="form-group">
              <label className="control-label" htmlFor="srcInput">
                Link to:
              </label>
              <input
                id="srcInput"
                type="text"
                className="form-control"
                defaultValue={this.props.element.src}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, "src", "value")}
              />
            </div>
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  id="do-center"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_checked_center}
                  value={true}
                  onChange={this.editElementProp.bind(
                    this,
                    "center",
                    "checked"
                  )}
                />
                <label className="custom-control-label" htmlFor="do-center">
                  Center?
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <label className="control-label" htmlFor="elementWidth">
                  Width:
                </label>
                <input
                  id="elementWidth"
                  type="text"
                  className="form-control"
                  defaultValue={this.props.element.width}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, "width", "value")}
                />
              </div>
              <div className="col-sm-3">
                <label className="control-label" htmlFor="elementHeight">
                  Height:
                </label>
                <input
                  id="elementHeight"
                  type="text"
                  className="form-control"
                  defaultValue={this.props.element.height}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, "height", "value")}
                />
              </div>
            </div>
          </div>
        )}
        {this.props.element.hasOwnProperty("label") && (
          <div className="form-group">
            <label>Display Label</label>
            <Editor
              toolbar={toolbar}
              defaultEditorState={editorState}
              onBlur={this.updateElement.bind(this)}
              onEditorStateChange={this.onEditorStateChange.bind(
                this,
                0,
                "label"
              )}
              stripPastedStyles={true}
            />
            <br />
            <div className="custom-control custom-checkbox">
              <input
                id="is-required"
                className="custom-control-input"
                type="checkbox"
                checked={this_checked}
                value={true}
                onChange={this.editElementProp.bind(
                  this,
                  "required",
                  "checked"
                )}
              />
              <label className="custom-control-label" htmlFor="is-required">
                Required
              </label>
            </div>
            {this.props.element.hasOwnProperty("readOnly") && (
              <div className="custom-control custom-checkbox">
                <input
                  id="is-read-only"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_read_only}
                  value={true}
                  onChange={this.editElementProp.bind(
                    this,
                    "readOnly",
                    "checked"
                  )}
                />
                <label className="custom-control-label" htmlFor="is-read-only">
                  Read only
                </label>
              </div>
            )}
            {this.props.element.hasOwnProperty("defaultToday") && (
              <div className="custom-control custom-checkbox">
                <input
                  id="is-default-to-today"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_default_today}
                  value={true}
                  onChange={this.editElementProp.bind(
                    this,
                    "defaultToday",
                    "checked"
                  )}
                />
                <label
                  className="custom-control-label"
                  htmlFor="is-default-to-today"
                >
                  Default to Today?
                </label>
              </div>
            )}
            {this.props.element.hasOwnProperty("showTimeSelect") && (
              <div className="custom-control custom-checkbox">
                <input
                  id="show-time-select"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_show_time_select}
                  value={true}
                  onChange={this.editElementProp.bind(
                    this,
                    "showTimeSelect",
                    "checked"
                  )}
                />
                <label
                  className="custom-control-label"
                  htmlFor="show-time-select"
                >
                  Show Time Select?
                </label>
              </div>
            )}
            {this_show_time_select &&
              this.props.element.hasOwnProperty("showTimeSelectOnly") && (
                <div className="custom-control custom-checkbox">
                  <input
                    id="show-time-select-only"
                    className="custom-control-input"
                    type="checkbox"
                    checked={this_show_time_select_only}
                    value={true}
                    onChange={this.editElementProp.bind(
                      this,
                      "showTimeSelectOnly",
                      "checked"
                    )}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="show-time-select-only"
                  >
                    Show Time Select Only?
                  </label>
                </div>
              )}
            {(this.state.element.element === "RadioButtons" ||
              this.state.element.element === "Checkboxes") &&
              canHaveDisplayHorizontal && (
                <div className="custom-control custom-checkbox">
                  <input
                    id="display-horizontal"
                    className="custom-control-input"
                    type="checkbox"
                    checked={this_checked_inline}
                    value={true}
                    onChange={this.editElementProp.bind(
                      this,
                      "inline",
                      "checked"
                    )}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="display-horizontal"
                  >
                    Display horizonal
                  </label>
                </div>
              )}
          </div>
        )}

        {this.state.element.element === "Signature" &&
        this.props.element.readOnly ? (
          <div className="form-group">
            <label className="control-label" htmlFor="variableKey">
              Variable Key:
            </label>
            <input
              id="variableKey"
              type="text"
              className="form-control"
              defaultValue={this.props.element.variableKey}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, "variableKey", "value")}
            />
            <p className="help-block">
              This will give the element a key that can be used to replace the
              content with a runtime value.
            </p>
          </div>
        ) : (
          <div />
        )}

        {canHavePageBreakBefore && (
          <div className="form-group">
            <label className="control-label">Print Options</label>
            <div className="custom-control custom-checkbox">
              <input
                id="page-break-before-element"
                className="custom-control-input"
                type="checkbox"
                checked={this_checked_page_break}
                value={true}
                onChange={this.editElementProp.bind(
                  this,
                  "pageBreakBefore",
                  "checked"
                )}
              />
              <label
                className="custom-control-label"
                htmlFor="page-break-before-element"
              >
                Page Break Before Element?
              </label>
            </div>
          </div>
        )}

        {canHaveAlternateForm && (
          <div className="form-group">
            <label className="control-label">Alternate/Signature Page</label>
            <div className="custom-control custom-checkbox">
              <input
                id="display-on-alternate"
                className="custom-control-input"
                type="checkbox"
                checked={this_checked_alternate_form}
                value={true}
                onChange={this.editElementProp.bind(
                  this,
                  "alternateForm",
                  "checked"
                )}
              />
              <label
                className="custom-control-label"
                htmlFor="display-on-alternate"
              >
                Display on alternate/signature Page?
              </label>
            </div>
          </div>
        )}

        {this.props.element.hasOwnProperty("step") && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeStep">
                Step
              </label>
              <input
                id="rangeStep"
                type="number"
                className="form-control"
                defaultValue={this.props.element.step}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, "step", "value")}
              />
            </div>
          </div>
        )}
        {this.props.element.hasOwnProperty("min_value") && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeMin">
                Min
              </label>
              <input
                id="rangeMin"
                type="number"
                className="form-control"
                defaultValue={this.props.element.min_value}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, "min_value", "value")}
              />
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.element.min_label}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, "min_label", "value")}
              />
            </div>
          </div>
        )}
        {this.props.element.hasOwnProperty("max_value") && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="rangeMax">
                Max
              </label>
              <input
                id="rangeMax"
                type="number"
                className="form-control"
                defaultValue={this.props.element.max_value}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, "max_value", "value")}
              />
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.element.max_label}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, "max_label", "value")}
              />
            </div>
          </div>
        )}
        {this.props.element.hasOwnProperty("default_value") && (
          <div className="form-group">
            <div className="form-group-range">
              <label className="control-label" htmlFor="defaultSelected">
                Default Selected
              </label>
              <input
                id="defaultSelected"
                type="number"
                className="form-control"
                defaultValue={this.props.element.default_value}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(
                  this,
                  "default_value",
                  "value"
                )}
              />
            </div>
          </div>
        )}
        {this.props.element.hasOwnProperty("static") &&
          this.props.element.static && (
            <div className="form-group">
              <label className="control-label">Text Style</label>
              <div className="custom-control custom-checkbox">
                <input
                  id="do-bold"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_checked_bold}
                  value={true}
                  onChange={this.editElementProp.bind(this, "bold", "checked")}
                />
                <label className="custom-control-label" htmlFor="do-bold">
                  Bold
                </label>
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  id="do-italic"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_checked_italic}
                  value={true}
                  onChange={this.editElementProp.bind(
                    this,
                    "italic",
                    "checked"
                  )}
                />
                <label className="custom-control-label" htmlFor="do-italic">
                  Italic
                </label>
              </div>
            </div>
          )}
        {this.props.element.showDescription && (
          <div className="form-group">
            <label className="control-label" htmlFor="questionDescription">
              Description
            </label>
            <TextAreaAutosize
              type="text"
              className="form-control"
              id="questionDescription"
              defaultValue={this.props.element.description}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, "description", "value")}
            />
          </div>
        )}
        {this.props.showCorrectColumn &&
          this.props.element.canHaveAnswer &&
          !this.props.element.hasOwnProperty("options") && (
            <div className="form-group">
              <label className="control-label" htmlFor="correctAnswer">
                Correct Answer
              </label>
              <input
                id="correctAnswer"
                type="text"
                className="form-control"
                defaultValue={this.props.element.correct}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, "correct", "value")}
              />
            </div>
          )}
        {this.props.element.canPopulateFromApi &&
          this.props.element.hasOwnProperty("options") && (
            <div className="form-group">
              <label className="control-label" htmlFor="optionsApiUrl">
                Populate Options from API
              </label>
              <div className="row">
                <div className="col-sm-6">
                  <input
                    className="form-control"
                    style={{ width: "100%" }}
                    type="text"
                    id="optionsApiUrl"
                    placeholder="http://localhost:8080/api/optionsdata"
                  />
                </div>
                <div className="col-sm-6">
                  <button
                    onClick={this.addOptions.bind(this)}
                    className="btn btn-success"
                  >
                    Populate
                  </button>
                </div>
              </div>
            </div>
          )}
        {this.props.element.customColumn &&
        !this.state.element.childNames &&
        !this.state.element.type &&
        (
          <div aria-label="Layout floating controls">
            <div
              className="assistive"
              role="status"
              aria-atomic="true"
              aria-relevant="all"
              aria-live="polite"
            >
              <span>Floating toolbar controls have been opened</span>
            </div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "3px",
                boxShadow: "grey",
                padding: "4px 8px",
                display: "flex",
                lineHeight: 1,
                boxSizing: " border-box",
              }}
              aria-label="Floating Toolbar"
              className=" css-1x89713"
            >
              <div className="css-vxcmzt">
                <div className="css-z25nd1">
                  <div role="presentation">
                    <div>
                      <button
                        aria-label="Two columns"
                        aria-pressed="false"
                        className="css-13ki9pu"
                        data-testid="fabric.editor.twoColumns"
                        type="button"
                        onClick={this.onEditorStateChange.bind(
                          this,
                          0,
                          "customColumn",
                          [6, 6]
                        )}
                      >
                        <span className="css-1ujqpe8">
                          <span
                            role="img"
                            aria-label="Two columns"
                            className="css-pxzk9z"
                            // style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-surface, #FFFFFF);"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              role="presentation"
                            >
                              <path
                                d="M5 5h5a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm9 0h5a1 1 0 011 1v12a1 1 0 01-1 1h-5a1 1 0 01-1-1V6a1 1 0 011-1z"
                                fill="#3F6078"
                                fillRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="css-z25nd1">
                <div role="presentation">
                  <div>
                    <button
                      aria-label="Three columns"
                      aria-pressed="false"
                      className="css-13ki9pu"
                      data-testid="fabric.editor.threeColumns"
                      type="button"
                      onClick={this.onEditorStateChange.bind(
                        this,
                        0,
                        "customColumn",
                        [4, 4, 4]
                      )}
                    >
                      <span className="css-1ujqpe8">
                        <span
                          role="img"
                          aria-label="Three columns"
                          className="css-pxzk9z"
                          //  style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-surface, #FFFFFF);"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            role="presentation"
                          >
                            <path
                              d="M5 5h2a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm6 0h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V6a1 1 0 011-1zm6 0h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V6a1 1 0 011-1z"
                              fill="#3F6078"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="css-z25nd1">
                <div role="presentation">
                  <div>
                    <button
                      aria-label="Right sidebar"
                      aria-pressed="true"
                      className="css-14hy36t"
                      data-testid="fabric.editor.rightSidebar"
                      type="button"
                      onClick={this.onEditorStateChange.bind(
                        this,
                        0,
                        "customColumn",
                        [10, 2]
                      )}
                    >
                      <span className="css-1ujqpe8">
                        <span
                          role="img"
                          aria-label="Right sidebar"
                          className="css-pxzk9z"
                          //  style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-surface, #FFFFFF);"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            role="presentation"
                          >
                            <path
                              d="M18 5h1a1 1 0 011 1v12a1 1 0 01-1 1h-1a1 1 0 01-1-1V6a1 1 0 011-1zM5 5h9a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                              fill="#3F6078"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="css-z25nd1">
                <div role="presentation">
                  <div>
                    <button
                      aria-label="Left sidebar"
                      aria-pressed="false"
                      className="css-13ki9pu"
                      data-testid="fabric.editor.leftSidebar"
                      type="button"
                      onClick={this.onEditorStateChange.bind(
                        this,
                        0,
                        "customColumn",
                        [2, 10]
                      )}
                    >
                      <span className="css-1ujqpe8">
                        <span
                          role="img"
                          aria-label="Left sidebar"
                          className="css-pxzk9z"
                          //  style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-surface, #FFFFFF);"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            role="presentation"
                          >
                            <path
                              d="M5 5h1a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm5 0h9a1 1 0 011 1v12a1 1 0 01-1 1h-9a1 1 0 01-1-1V6a1 1 0 011-1z"
                              fill="#3F6078"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="css-z25nd1">
                <div role="presentation">
                  <div>
                    <button
                      aria-label="Three columns with sidebars"
                      aria-pressed="false"
                      className="css-13ki9pu"
                      data-testid="fabric.editor.threeColumnsWithSidebars"
                      type="button"
                      onClick={this.onEditorStateChange.bind(
                        this,
                        0,
                        "customColumn",
                        [2, 8, 2]
                      )}
                    >
                      <span className="css-1ujqpe8">
                        <span
                          role="img"
                          aria-label="Three columns with sidebars"
                          className="css-pxzk9z"
                          //  style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-surface, #FFFFFF);"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            role="presentation"
                          >
                            <path
                              d="M5 5a1 1 0 011 1v12a1 1 0 01-2 0V6a1 1 0 011-1zm4 0h6a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1zm10 0a1 1 0 011 1v12a1 1 0 01-2 0V6a1 1 0 011-1z"
                              fill="#3F6078"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="css-z25nd1">
                <div className="separator css-1eco9xy"></div>
              </div>
              <div className="css-z25nd1">
                <div role="presentation">
                  <div>
                    <button
                      aria-label="Remove"
                      className="css-j4rl2i"
                      data-testid="fabric.editor.remove"
                      type="button"
                      onClick={this.onEditorStateChange.bind(
                        this,
                        0,
                        "customColumn",
                        []
                      )}
                    >
                      <span className="css-1ujqpe8">
                        <span
                          role="img"
                          aria-label="Remove"
                          className="css-pxzk9z"
                          // style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-surface, #FFFFFF);"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            role="presentation"
                          >
                            <path
                              d="M7 7h10a1 1 0 010 2H7a1 1 0 110-2zm2.78 11a1 1 0 01-.97-.757L7.156 10.62A.5.5 0 017.64 10h8.72a.5.5 0 01.485.621l-1.656 6.622a1 1 0 01-.97.757H9.781zM11 6h2a1 1 0 011 1h-4a1 1 0 011-1z"
                              fill="#3F6078"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.props.element.hasOwnProperty("options") && (
          <DynamicOptionList
            showCorrectColumn={this.props.showCorrectColumn}
            canHaveOptionCorrect={canHaveOptionCorrect}
            canHaveOptionValue={canHaveOptionValue}
            data={this.props.preview.state.data}
            updateElement={this.props.updateElement}
            preview={this.props.preview}
            element={this.props.element}
            key={this.props.element.options.length}
          />
        )}
      </div>
    );
  }
}
FormElementsEdit.defaultProps = { className: "edit-element-fields" };
