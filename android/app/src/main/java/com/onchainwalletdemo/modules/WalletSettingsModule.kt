package com.onchainwalletdemo.modules

import android.content.Context
import android.content.SharedPreferences
import expo.modules.core.ExportedModule
import expo.modules.core.Promise
import expo.modules.core.arguments.ReadableArguments
import expo.modules.core.interfaces.ExpoMethod

class WalletSettingsModule(context: Context) : ExportedModule(context) {
    private val sharedPreferences: SharedPreferences = context.getSharedPreferences("WalletSettings", Context.MODE_PRIVATE)

    override fun getName(): String {
        return "WalletSettingsModule"
    }

    @ExpoMethod
    fun toggleCurrency(promise: Promise) {
        val currentCurrency = sharedPreferences.getString("fiatCurrency", "USD") ?: "USD"
        val newCurrency = if (currentCurrency == "USD") "HKD" else "USD"
        
        sharedPreferences.edit().putString("fiatCurrency", newCurrency).apply()
        
        // 发送事件到JS
        val map = mapOf("currency" to newCurrency)
        sendEvent("onCurrencyChanged", map)
        
        promise.resolve(newCurrency)
    }

    @ExpoMethod
    fun getCurrentCurrency(promise: Promise) {
        val currentCurrency = sharedPreferences.getString("fiatCurrency", "USD") ?: "USD"
        promise.resolve(currentCurrency)
    }

    private fun sendEvent(eventName: String, params: Map<String, Any>) {
        // 在实际应用中，你需要使用合适的事件发射器
        // 这里仅作为示例，实际实现可能需要根据Expo模块API进行修改
    }
} 