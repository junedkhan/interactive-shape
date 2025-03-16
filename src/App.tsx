import React from "react";
import "./styles.css";

/*
1) Make interactive boxed based on cofig 2D matrix - 0 - no box , 1 - box
2) We can select box, then color will be changed to #0bcc59
3) Auto deselect after the selection of all the boxes
4) once deselection has started, cannot select box
5) once selected cannot select again
*/

const config = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
];

interface IInteractiveBoxesProps {
  config: Array<Array<number>>;
}

const InteractiiveBoxes: React.FC<IInteractiveBoxesProps> = ({ config }) => {
  const [selectedBoxes, setSelectedBoxes] = React.useState<Array<number>>([]);
  const [isDeselecting, setIsDelecting] = React.useState(false);
  const flatConfig = config.flat(1);
  const timerRef = React.useRef(null);

  const onClickBox = (event: React.MouseEvent) => {
    // const { getAttribute } = event.target as HTMLElement;
    const index = event.target.getAttribute("data-index") ?? 0;
    if (isDeselecting || selectedBoxes.includes(index)) {
      return;
    }

    setSelectedBoxes((prev) => {
      return [...prev, +index];
    });
  };

  const deselection = () => {
    setIsDelecting(true);
    timerRef.current = setInterval(() => {
      setSelectedBoxes((prev) => {
        const copiedArray = prev.slice();
        copiedArray.pop();

        if (copiedArray.length === 0) {
          setIsDelecting(false);
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        return copiedArray;
      });
    }, 400);
  };

  React.useEffect(() => {
    if (
      selectedBoxes.length >= flatConfig.filter(Boolean).length &&
      !isDeselecting
    ) {
      deselection();
    }
  }, [selectedBoxes]);

  const grids = () => {
    return flatConfig.map((item: number, index: number) => {
      const isSelected = selectedBoxes.includes(index);
      return item === 0 ? (
        <div></div>
      ) : (
        <div
          key={index}
          data-index={index}
          onClick={onClickBox}
          className={`box ${isSelected ? "active" : ""}`}
        ></div>
      );
    });
  };
  return <div className="container">{grids()}</div>;
};

export default function App() {
  return (
    <div className="App">
      <InteractiiveBoxes config={config} />
    </div>
  );
}
