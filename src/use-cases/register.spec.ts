import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

// testes unitários não devem acessar banco de dados e nem nada externo

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John",
      email: "john@email.com",
      password: "12345",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John",
      email: "john@email.com",
      password: "12345",
    });

    const isPasswordCorrectlyHashed = await compare("12345", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "johnexemple@email.com";

    await sut.execute({
      name: "John",
      email,
      password: "12345",
    });

    await expect(() =>
      sut.execute({
        name: "John",
        email,
        password: "12345",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
