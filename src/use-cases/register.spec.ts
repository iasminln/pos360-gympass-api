import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

// testes unitários não devem acessar banco de dados e nem nada externo

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John",
      email: "john@email.com",
      password: "12345",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John",
      email: "john@email.com",
      password: "12345",
    });

    const isPasswordCorrectlyHashed = await compare("12345", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "johnexemple@email.com";

    await registerUseCase.execute({
      name: "John",
      email,
      password: "12345",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "John",
        email,
        password: "12345",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
