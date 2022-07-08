import { provide, inject } from 'vue';

const CTX_PROVIDER_KEY = 'CTX_PROVIDER_KEY';
const STORE_CTX_PROVIDER_KEY = 'STORE_CTX_PROVIDER_KEY';

export const Ctx = function (defaultValue) {
  provide(CTX_PROVIDER_KEY, defaultValue);
};

export const StoreCtx = function (defaultValue) {
  provide(STORE_CTX_PROVIDER_KEY, defaultValue);
};

export const useGlobal = () => inject(CTX_PROVIDER_KEY);

export const useStore = () => inject(STORE_CTX_PROVIDER_KEY);
