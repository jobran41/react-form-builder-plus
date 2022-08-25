/* eslint-disable camelcase */
import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import ComponentHeader from "../form-elements/component-header";
import ComponentLabel from "../form-elements/component-label";
import Dustbin from "./dustbin";
import ItemTypes from "../ItemTypes";

import "./style.css";

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

class MultiColumnRow extends React.Component {
  /*   logArrayElements(element, index, array) {
    console.log(`a[${index}] = ${element}`);
  } */

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
    } = this.props;
    const { childItems, pageBreakBefore, childNames } = data;
    let baseClasses = "SortableItem rfb-item";
    if (pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    /*  [0, 1, 2].forEach(this.logArrayElements); */

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div>
          <ComponentLabel {...this.props} />
          {children && (
            <Dustbin
              style={{ width: "100%" }}
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
                <Tabs key={`key`}>
                  <TabList>
                    {childNames.map((de, l) => {
                      return <Tab>{de}</Tab>;
                    })}
                  </TabList>
                  {childItems.map((de, l) => {
                    return (
                      <TabPanel
                        style={{
                          width: "100%",
                        }}
                        className="row"
                      >
                        {de &&
                          de.map((x, i) => (
                            <div
                              key={`${i}_${x || "_"}${l}`}
                              className={
                                customColumn
                                  ? `col-md-${customColumn[i]}`
                                  : className
                              }
                            >
                              {controls ? (
                                controls[l][i]
                              ) : (
                                <Dustbin
                                  style={{ width: "100%" }}
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
                          ))}
                      </TabPanel>
                    );
                  })}
                </Tabs>
              ) : (
                childItems.map((x, i) => {
                  return (
                    <div
                      key={`${i}_${x || "_"}`}
                      className={
                        customColumn ? `col-md-${customColumn[i]}` : className
                      }
                    >
                      {controls ? (
                        controls[i]
                      ) : (
                        <Dustbin
                          style={{ width: "100%" }}
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
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const TwoColumnRow = ({ data, class_name, ...rest }) => {
  const className = class_name || "col-md-6";
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
  console.log("data :>> ", data);
  const className = class_name || "col-md-4";

  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null, null, null];
    data.isContainer = true;
  }
  data.isContainer = true;
  return (
    <MultiColumnRow
      children={"children"}
      {...rest}
      className={className}
      data={data}
    />
  );
};

const FourColumnRow = ({ data, class_name, ...rest }) => {
  const className = class_name || "col-md-3";
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
