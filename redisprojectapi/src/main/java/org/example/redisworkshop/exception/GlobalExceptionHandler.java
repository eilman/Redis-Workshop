package org.example.redisworkshop.exception;

import org.example.redisworkshop.model.RedisCommandResult;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public RedisCommandResult handleNullPointer(NullPointerException ex) {
        return new RedisCommandResult(
                "ERROR",
                null,
                "Eksik parametre veya null deger hatasi (Missing parameter or null value): " + ex.getMessage(),
                0
        );
    }

    @ExceptionHandler(NumberFormatException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public RedisCommandResult handleNumberFormat(NumberFormatException ex) {
        return new RedisCommandResult(
                "ERROR",
                null,
                "Gecersiz sayi formati (Invalid number format): " + ex.getMessage(),
                0
        );
    }

    @ExceptionHandler(ClassCastException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public RedisCommandResult handleClassCast(ClassCastException ex) {
        return new RedisCommandResult(
                "ERROR",
                null,
                "Tip uyumsuzlugu hatasi (Type mismatch): " + ex.getMessage(),
                0
        );
    }

    @ExceptionHandler(RedisConnectionFailureException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public RedisCommandResult handleRedisConnection(RedisConnectionFailureException ex) {
        return new RedisCommandResult(
                "ERROR",
                null,
                "Redis baglanti hatasi (Redis connection failure). Redis sunucusunun calistiginden emin olun: " + ex.getMessage(),
                0
        );
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public RedisCommandResult handleGeneral(Exception ex) {
        return new RedisCommandResult(
                "ERROR",
                null,
                "Beklenmeyen hata (Unexpected error): " + ex.getMessage(),
                0
        );
    }
}
