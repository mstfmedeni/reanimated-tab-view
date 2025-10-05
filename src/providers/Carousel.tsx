import React, { createContext, useContext, useMemo } from 'react';
import { useInternalContext } from './Internal';
import { useSharedValue, type SharedValue, makeMutable } from 'react-native-reanimated';
import { usePropsContext } from './Props';

type CarouselContext = {
  translationPerSceneContainer: number;
  swipeTranslationXSV: SharedValue<number>;
  currentRouteIndexSV: SharedValue<number>;
};

const CarouselContext = createContext<CarouselContext>({
  translationPerSceneContainer: 0,
  swipeTranslationXSV: makeMutable(0),
  currentRouteIndexSV: makeMutable(0),
});

export const CarouselContextProvider: React.FC<{ children?: React.ReactNode }> = React.memo(
  function CarouselContextProvider({ children }) {
    //#region context
    const { navigationState, sceneContainerGap } = usePropsContext();

    const { tabViewLayout, initialRouteIndex } = useInternalContext();
    //#endregion

    //#region variables
    const translationPerSceneContainer = useMemo(
      () => tabViewLayout.width + sceneContainerGap,
      [tabViewLayout.width, sceneContainerGap]
    );

    const swipeTranslationXSV = useSharedValue(
      -navigationState.index * translationPerSceneContainer
    );

    const currentRouteIndexSV = useSharedValue(initialRouteIndex);
    //endregion

    const value = useMemo(
      () => ({
        translationPerSceneContainer,
        swipeTranslationXSV,
        currentRouteIndexSV,
      }),
      [translationPerSceneContainer, swipeTranslationXSV, currentRouteIndexSV]
    );
    return (
      <CarouselContext.Provider value={value}>
        {children}
      </CarouselContext.Provider>
    );
  }
);

export const useCarouselContext = () => useContext(CarouselContext);
