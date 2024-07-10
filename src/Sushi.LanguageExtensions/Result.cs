using Sushi.LanguageExtensions.Errors;

namespace Sushi.LanguageExtensions
{
    /// <summary>
    /// Represents a result to an operation, which either succeeds or fails with an instance of <typeparamref name="TError"/>.
    /// </summary>
    /// <typeparam name="TError"></typeparam>
    public record Result<TError>
        where TError : Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="Result{TError}"/> if the operation was successful.
        /// </summary>
        public Result()
        {
            IsSuccess = true;
        }

        /// <summary>
        /// Creates a new instance of <see cref="Result{TError}"/> if the operation failed.
        /// </summary>
        /// <param name="error"></param>
        public Result(TError error)
        {
            IsSuccess = false;
            Error = error;
        }

        /// <summary>
        /// If true, the operation succeeded. If false, the operation failed.
        /// </summary>
        public bool IsSuccess { get; private set; }

        /// <summary>
        /// Contains the error if <see cref="IsSuccess"/> is false.
        /// </summary>
        public TError? Error { get; private set; }

        /// <summary>
        /// Creates a <see cref="Result{TError}"/> from a <typeparamref name="TError"/> object.
        /// </summary>
        /// <param name="error"></param>
        public static implicit operator Result<TError>(TError error) => new Result<TError>(error);

        /// <summary>
        /// Creates a <see cref="Result{Error}"/> from a <see cref="Result{TError}"/> object.
        /// </summary>
        public static implicit operator Result<Error>(Result<TError> result) =>
            result.IsSuccess ? new Result<Error>() : new Result<Error>(result.Error!);

        /// <summary>
        /// If the operation was successful, <paramref name="Success"/> is executed. If it failed, <paramref name="Fail"/> is executed.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="Success"></param>
        /// <param name="Fail"></param>
        /// <returns></returns>
        public R Match<R>(Func<R> Success, Func<TError, R> Fail) => IsSuccess ? Success() : Fail(Error!);

        /// <summary>
        /// If the operation was successful, <paramref name="Success"/> is executed. If it failed, <paramref name="Fail"/> is executed.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="Success"></param>
        /// <param name="Fail"></param>
        /// <returns></returns>
        public async Task<R> MatchAsync<R>(Func<Task<R>> Success, Func<TError, R> Fail) =>
            IsSuccess ? await Success() : Fail(Error!);

        
    }

    /// <summary>
    /// Represents a result to an operation, which either succeeds with an instance of <typeparamref name="TValue"/> or fails with an instance of <typeparamref name="TError"/>.
    /// </summary>
    public record Result<TValue, TError> : Result<TError>
        where TError : Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="Result{TValue, TError}"/> if the operation was successful.
        /// </summary>
        /// <param name="value"></param>
        public Result(TValue value)
            : base()
        {
            Value = value;
        }

        /// <summary>
        /// Creates a new instance of <see cref="Result{TValue, TError}"/> if the operation failed.
        /// </summary>
        /// <param name="error"></param>
        public Result(TError error)
            : base(error) { }

        /// <summary>
        /// Contains the result if <see cref="Result{TError}.IsSuccess"/> is true.
        /// </summary>
        public TValue? Value { get; }

        /// <summary>
        /// Creates a <see cref="Result{TValue, TError}"/> from a <typeparamref name="TValue"/> object.
        /// </summary>
        public static implicit operator Result<TValue, TError>(TValue value) => new Result<TValue, TError>(value);

        /// <summary>
        /// Creates a <see cref="Result{TValue, TError}"/> from a <typeparamref name="TError"/> object.
        /// </summary>
        public static implicit operator Result<TValue, TError>(TError error) => new Result<TValue, TError>(error);

        /// <summary>
        /// Creates a <see cref="Result{TValue, Error}"/> from a <see cref="Result{TValue, TError}"/> object.
        /// </summary>
        public static implicit operator Result<TValue, Error>(Result<TValue, TError> result) =>
            result.IsSuccess ? new Result<TValue, Error>(result.Value!) : new Result<TValue, Error>(result.Error!);

        /// <summary>
        /// If the operation was successful, <paramref name="Success"/> is executed. If it failed, <paramref name="Fail"/> is executed.
        /// </summary>
        public void Match(Action<TValue> Success, Action<TError> Fail) 
        {
            if (IsSuccess)
            {
                Success(Value!);
            }
            else
            {
                Fail(Error!);
            }
        }

        /// <summary>
        /// If the operation was successful, <paramref name="Success"/> is executed. If it failed, <paramref name="Fail"/> is executed.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="Success"></param>
        /// <param name="Fail"></param>
        /// <returns></returns>
        public R Match<R>(Func<TValue, R> Success, Func<TError, R> Fail) => IsSuccess ? Success(Value!) : Fail(Error!);

        /// <summary>
        /// If the operation was successful, <paramref name="Success"/> is executed. If it failed, <paramref name="Fail"/> is executed.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="Success"></param>
        /// <param name="Fail"></param>
        /// <returns></returns>
        public async Task<R> MatchAsync<R>(Func<TValue, Task<R>> Success, Func<TError, R> Fail) =>
            IsSuccess ? await Success(Value!) : Fail(Error!);

        /// <summary>
        /// If the operation was successful, <paramref name="Success"/> is executed. If it failed, <paramref name="Fail"/> is executed.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="Success"></param>
        /// <param name="Fail"></param>
        /// <returns></returns>
        public async Task<R> MatchAsync<R>(Func<TValue, Task<R>> Success, Func<TError, Task<R>> Fail) =>
            IsSuccess ? await Success(Value!) : await Fail(Error!);

        /// <summary>
        /// Creates a new instance of <see cref="Result{TValue, TError}"/> where <typeparamref name="TDerived"/> is cast to its base type <typeparamref name="TValue"/>.
        /// </summary>
        /// <typeparam name="TDerived"></typeparam>
        /// <param name="original"></param>
        /// <returns></returns>
        public static Result<TValue, TError> From<TDerived>(Result<TDerived, TError> original) where TDerived : TValue
        {
            return original.Match(
                Success: value => new Result<TValue, TError>(value),
                Fail: error => new Result<TValue, TError>(error));
        }
    }

    /// <summary>
    /// Contains helper methods to work with Result objects.
    /// </summary>
    public static class Result
    {
        /// <summary>
        /// Creates a new instance of <see cref="Result{TError}"/> if the operation succeeded.
        /// </summary>
        /// <returns></returns>
        public static Result<TError> Success<TError>() where TError : Error => new();
    }
}
