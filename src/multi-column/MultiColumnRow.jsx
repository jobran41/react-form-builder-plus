/* eslint-disable camelcase */
import React from 'react';

import ComponentHeader from '../form-elements/component-header';
/* import ComponentLabel from '../form-elements/component-label'; */
// eslint-disable-next-line import/no-cycle
import Dustbin from './dustbin';
import ItemTypes from '../ItemTypes';
import ID from '../UUID';

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

class MultiColumnRow extends React.Component {
  /*   logArrayElements(element, index, array) {
    console.log(`a[${index}] = ${element}`);
  } */

  state = {
    active: 0,
    currentAccrodion: '',
  };

  render() {
    const {
      controls,
      data,
      editModeOn,
      getDataById,
      setAsChild,
      removeChild,
      seq,
      className,
      index,
      customColumn,
      children,
      type,
    } = this.props;
    const { childItems, pageBreakBefore, childNames } = data;
    let baseClasses = 'SortableItem rfb-item';
    if (pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="container">
          {/* <ComponentLabel {...this.props} /> */}
          {children && (
            <Dustbin
              style={{ width: '100%' }}
              data={data}
              accepts={accepts}
              items={childItems}
              col={null}
              lig={null}
              parentIndex={index}
              editModeOn={editModeOn}
              _onDestroy={() => removeChild(data, null, null)}
              getDataById={getDataById}
              setAsChild={setAsChild}
              seq={seq}
            >
              {children}
            </Dustbin>
          )}
          {!children && (
            <div className="row">
              {childNames ? (
                <>
                  {' '}
                  {type ? (
                    <div
                      style={{
                        width: '100%',
                      }}
                      className="accordion"
                      id="accordionExample"
                    >
                      <div className="card">
                        <div className="card-header" id="headingOne">
                          <h2 className="mb-0">
                            <button
                              onClick={() => {
                                if (
                                  childNames[0] === this.state.currentAccrodion
                                ) {
                                  this.setState({
                                    accrodion: childNames[0],
                                    currentAccrodion: ID.uuid(),
                                  });
                                } else {
                                  this.setState({
                                    accrodion: childNames[0],
                                    currentAccrodion: childNames[0],
                                  });
                                }
                              }}
                              className="btn btn-link btn-block text-left"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              {childNames && childNames[0]}
                            </button>
                          </h2>
                        </div>

                        <div
                          className={`collapse ${
                            this.state.currentAccrodion === childNames[0]
                              ? 'show'
                              : ''
                          }`}
                          id="collapseOne"
                          aria-labelledby="headingOne"
                          data-parent="#accordionExample"
                        >
                          <div className="card-body">
                            {childItems.map(
                              (de, l) => de &&
                                de.map((x, i) => (
                                  <div
                                    key={`${i}_${x || '_'}${l}`}
                                    id={`pills-${childNames && childNames[i]}`}
                                    role="tabpanel"
                                    aria-labelledby={`pills-${
                                      childNames && childNames[i]
                                    }-tab`}
                                    className={`${
                                      customColumn
                                        ? `col-md-${customColumn[i]} `
                                        : className
                                    }tab-pane fade  ${
                                      i === this.state.active
                                        ? 'active show'
                                        : ''
                                    }`}
                                  >
                                    {controls ? (
                                      controls[l][i]
                                    ) : (
                                      <Dustbin
                                        style={{ width: '100%' }}
                                        data={data}
                                        accepts={accepts}
                                        items={childItems}
                                        col={l}
                                        lig={i}
                                        parentIndex={index}
                                        editModeOn={editModeOn}
                                        _onDestroy={() => removeChild(data, l, i)
                                        }
                                        getDataById={getDataById}
                                        setAsChild={setAsChild}
                                        seq={seq}
                                      />
                                    )}
                                  </div>
                                )),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ul
                        class="nav nav-pills mb-3"
                        id="pills-tab"
                        role="tablist"
                      >
                        {childNames.map((de, l) => (
                          <li class="nav-item" role="presentation">
                            <button
                              className={`nav-link ${
                                l === this.state.active ? 'active' : ''
                              }`}
                              id={`pills-${de}-tab`}
                              data-toggle="pill"
                              data-target={`#pills-${de}`}
                              type="button"
                              role="tab"
                              aria-controls={`pills-${de}`}
                              aria-selected={l === this.state.active}
                              onClick={() => {
                                this.setState({ active: l });
                              }}
                            >
                              {de}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div
                        className="tab-content"
                        id="pills-tabContent"
                        style={{
                          width: '100%',
                        }}
                        className="row"
                      >
                        {childItems.map(
                          (de, l) => de &&
                            de.map((x, i) => (
                              <div
                                key={`${i}_${x || '_'}${l}`}
                                id={`pills-${childNames && childNames[i]}`}
                                role="tabpanel"
                                aria-labelledby={`pills-${
                                  childNames && childNames[i]
                                }-tab`}
                                className={`${
                                  customColumn
                                    ? `col-md-${customColumn[i]} `
                                    : className
                                }tab-pane fade  ${
                                  i === this.state.active ? 'active show' : ''
                                }`}
                              >
                                {controls ? (
                                  controls[l][i]
                                ) : (
                                  <Dustbin
                                    style={{ width: '100%' }}
                                    data={data}
                                    accepts={accepts}
                                    items={childItems}
                                    col={l}
                                    lig={i}
                                    parentIndex={index}
                                    editModeOn={editModeOn}
                                    _onDestroy={() => removeChild(data, l, i)}
                                    getDataById={getDataById}
                                    setAsChild={setAsChild}
                                    seq={seq}
                                  />
                                )}
                              </div>
                            )),
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                childItems.map((x, i) => (
                  <div
                    key={`${i}_${x || '_'}`}
                    className={
                      customColumn ? `col-md-${customColumn[i]}` : className
                    }
                  >
                    {controls ? (
                      controls[i]
                    ) : (
                      <Dustbin
                        style={{ width: '100%' }}
                        data={data}
                        accepts={accepts}
                        items={childItems}
                        col={i}
                        parentIndex={index}
                        editModeOn={editModeOn}
                        _onDestroy={() => removeChild(data, i)}
                        getDataById={getDataById}
                        setAsChild={setAsChild}
                        seq={seq}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const TwoColumnRow = ({ data, class_name, ...rest }) => {
  const className = class_name || 'col-md-6';
  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [
      [null, null, null, null],
      [null, null, null, null],
    ];
    data.isContainer = true;
    data.childNames = [null, null];
  }
  return (
    <MultiColumnRow
      {...rest}
      className={className}
      data={data}
      customColumn={data.customColumn}
    />
  );
};

const ThreeColumnRow = ({ data, class_name, ...rest }) => {
  const className = class_name || 'col-md-4';

  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [[null]];
    data.childNames = [null];
    data.isContainer = true;
  }

  data.isContainer = true;
  data.type = true;

  return (
    <MultiColumnRow
      // children={"children"}
      {...rest}
      className={className}
      type="accrodion"
      data={data}
    />
  );
};

const FourColumnRow = ({ data, class_name, ...rest }) => {
  const className = class_name || 'col-md-3';
  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null, null, null, null];
    data.isContainer = true;
  }
  data.isContainer = true;
  return (
    <MultiColumnRow
      {...rest}
      className={className}
      data={data}
      customColumn={data?.customColumn}
    />
  );
};

export { TwoColumnRow, ThreeColumnRow, FourColumnRow };
