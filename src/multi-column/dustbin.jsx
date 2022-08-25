import React, { useImperativeHandle, Fragment } from "react";
import { DropTarget } from "react-dnd";
import FormElements from "../form-elements";
import ItemTypes from "../ItemTypes";

import { TwoColumnRow, ThreeColumnRow, FourColumnRow } from ".";

import CustomElement from "../form-elements/custom-element";
import Registry from "../stores/registry";

function getCustomElement(item, props) {
  if (!item.component || typeof item.component !== "function") {
    item.component = Registry.get(item.key);
    if (!item.component) {
      console.error(`${item.element} was not registered`);
    }
  }
  return (
    <CustomElement
      {...props}
      mutable={false}
      key={`form_${item.id}`}
      data={item}
    />
  );
}

function getContainerElement(item) {
  const listComp = {
    FourColumnRow,
    TwoColumnRow,
    ThreeColumnRow,
  };

  const Elmt = listComp[item.element];

  return (
    <div className="nestedDrogDrop">
      {/*    <FourColumnRow
        editModeOn={item.restFn.editModeOn}
        getDataById={item.restFn.getDataById}
        _onDestroy={item.restFn._onDestroy}
        setAsChild={item.restFn.setAsChild}
        children={
          <Elmt
            editModeOn={item.restFn.editModeOn}
            getDataById={item.restFn.getDataById}
            _onDestroy={item.restFn._onDestroy}
            setAsChild={item.restFn.setAsChild}
            data={{ ...item }}
          />
        }
        data={{ ...item }}
      /> */}
      <Elmt
        editModeOn={item.restFn.editModeOn}
        getDataById={item.restFn.getDataById}
        _onDestroy={item.restFn._onDestroy}
        removeChild={item.restFn._onDestroy}
        setAsChild={item.restFn.setAsChild}
        data={{ ...item, isNested: true }}
      />
    </div>
  );
}

const listComp = {
  FourColumnRow,
  TwoColumnRow,
  ThreeColumnRow,
};

function getElement(item, props) {
  if (!item) return null;

  const Element = item.custom
    ? () => getCustomElement(item, props)
    : FormElements[item.element || item.key];

  return (
    <Fragment>
      <Element {...props} key={`form_${item.id}`} data={item} />
    </Fragment>
  );
}

function getStyle(backgroundColor) {
  return {
    border: "1px solid rgba(0,0,0,0.2)",
    minHeight: "2rem",
    //  minWidth: '12rem',
    width: "100%",
    backgroundColor,
    padding: 0,
    float: "left",
  };
}

function isContainer(item) {
  if (item.itemType !== ItemTypes.CARD) {
    const { data } = item;
    if (data) {
      if (data.isContainer) {
        return true;
      }
      if (data.field_name) {
        return data.field_name.indexOf("_col_row") > -1;
      }
    }
  }
  return false;
}

function isContainerOfContainer(item) {
  let isWrapContainer = [];
  if (isContainer(item)) {
    isWrapContainer =
      item.data.childItems &&
      item.data.childItems.map((el) => {
        if (el) {
          const nestedItem = item.getDataById(el);
          return isContainer({ data: nestedItem });
        }
        return null;
      });
  }

  const emptyCell = item.data.childItems[item.col];
  console.log("emptyCell :>> ", emptyCell);
  const result =
    emptyCell === null
      ? false
      : isWrapContainer
      ? isWrapContainer.filter((d) => d !== null && d).length !== 0
      : isWrapContainer;

  return result;
}
const Dustbin = React.forwardRef(
  (
    {
      greedy,
      lig,
      isOver,
      isOverCurrent,
      connectDropTarget,
      items,
      col,
      children,
      getDataById,
      ...rest
    },
    ref
  ) => {
    const item = getDataById(
      Array.isArray(items[col]) ? items[col][lig] : items[col]
    );

    useImperativeHandle(
      ref,
      () => ({
        onDrop: (/* dropped */) => {
          /*  console.log('onDrop', dropped);
          console.log('ref :>> ', ref); */
        },
      }),
      []
    );

    let backgroundColor = "rgba(0, 0, 0, .03)";

    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = "darkgreen";
    }
    console.log("item :>> getContainerElement", item);
    const element = item?.customColumn ? (
      getContainerElement(
        { ...item, restFn: { ...rest, getDataById } },
        listComp[item.element]
      )
    ) : (
      <div className="jobran" style={getStyle(backgroundColor)}>
        {getElement(item, rest)}
        {children}
      </div>
    );
    // console.log('accepts, canDrop', accepts, canDrop);
    return connectDropTarget(element);
  }
);

export default DropTarget(
  (props) => props.accepts,
  {
    drop(props, monitor, component) {
      if (!component) {
        return;
      }

      const item = monitor.getItem();
      console.log(
        "!isContainerOfContainer(props) :>> ",
        !isContainerOfContainer(props)
      );

      component.onDrop(item);
      if (item.data && typeof props.setAsChild === "function") {
        const isNew = !item.data.id;
        const data = isNew ? item.onCreate(item.data) : item.data;
        if (!isContainerOfContainer(props)) {
          props.setAsChild(props.data, data, props.col, props.lig);
        }
      }
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  })
)(Dustbin);
