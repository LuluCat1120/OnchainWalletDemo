#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// 这个接口将模块注册到React Native
@interface RCT_EXTERN_MODULE(SettingsModule, RCTEventEmitter)

// 导出方法给JavaScript
RCT_EXTERN_METHOD(getCurrency:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setCurrency:(NSString *)currency
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(toggleCurrency:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(openSettingsPage:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end 