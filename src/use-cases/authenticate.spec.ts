import { expect, describe, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

// testes unitários não devem acessar banco de dados e nem nada externo

describe("Authenticate Use Case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();
    // sut = system under test
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "John",
      email: "john@email.com",
      password_hash: await hash("12345", 6),
    });

    const { user } = await sut.execute({
      email: "john@email.com",
      password: "12345",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(() =>
      sut.execute({
        email: "john@email.com",
        password: "12345",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "John",
      email: "john@email.com",
      password_hash: await hash("12345", 6),
    });

    await expect(() =>
      sut.execute({
        email: "john@email.com",
        password: "123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
