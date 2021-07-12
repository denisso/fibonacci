#include <nan.h>

int currentNumber = 0;

NAN_METHOD(Get) {
    int incNumber = 1, fibonacciNumber = 0, temp, num = currentNumber;

    while (num >= 0){
        temp = incNumber;
        incNumber = incNumber + fibonacciNumber;
        fibonacciNumber = temp;
        num--;
    }

    currentNumber++;

    info.GetReturnValue().Set(Nan::New<v8::String>(std::to_string(fibonacciNumber)).ToLocalChecked());
}

NAN_METHOD(Reset){
    currentNumber = 0;
    info.GetReturnValue().Set(Nan::New<v8::String>(std::to_string(0)).ToLocalChecked());
}

NAN_MODULE_INIT(Initialize) {
    NAN_EXPORT(target, Get);
    NAN_EXPORT(target, Reset);
}
NODE_MODULE(fibonacciModule, Initialize)