import { StatusCodes } from "http-status-codes";

import { Readable } from "node:stream";
import type { Bill } from "@/api/bills/billsModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import csv from "csv-parser";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { BillsRepository } from "./billsRepository";

export class BillsService {
  private billsRepository: BillsRepository;

  constructor(repository: BillsRepository = new BillsRepository()) {
    this.billsRepository = repository;
  }

  // Retrieves all bills from the database
  async findAll(): Promise<ServiceResponse<Bill[] | null>> {
    try {
      const bills = await this.billsRepository.findAllAsync();
      if (!bills || bills.length === 0) {
        return ServiceResponse.failure("No Bills found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Bill[]>("Bills found", bills);
    } catch (ex) {
      const errorMessage = `Error finding all bills: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving bills.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  isDuplicate(bill: Bill, bills: Bill[]): boolean {
    const areVendorsSimilar = (vendor1: string, vendor2: string) => {
      // Convert both strings to lowercase for case-insensitive comparison
      const v1 = vendor1.toLowerCase();
      const v2 = vendor2.toLowerCase();

      // Check if the names match exactly
      if (v1 === v2) return true;

      // Check if there's one extra letter in either of the names
      if (isOneExtraLetter(v1, v2) || isOneExtraLetter(v2, v1)) return true;

      // Check if there's one missing letter in either of the names
      if (isOneMissingLetter(v1, v2) || isOneMissingLetter(v2, v1)) return true;

      // Check if there's exactly one different letter
      if (isOneDifferentLetter(v1, v2)) return true;

      // If none of the conditions match, return false
      return false;
    };

    // Helper function to check if one string has one extra letter
    const isOneExtraLetter = (short: string, long: string) => {
      if (long.length - short.length !== 1) return false;
      for (let i = 0; i < long.length; i++) {
        if (short === long.slice(0, i) + long.slice(i + 1)) {
          return true;
        }
      }
      return false;
    };

    // Helper function to check if one string has one missing letter
    const isOneMissingLetter = (long: string, short: string) => {
      if (long.length - short.length !== 1) return false;
      return isOneExtraLetter(short, long);
    };

    // Helper function to check if there's exactly one different letter
    const isOneDifferentLetter = (str1: string, str2: string) => {
      if (str1.length !== str2.length) return false;
      let diffCount = 0;
      for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
          diffCount++;
          if (diffCount > 1) return false;
        }
      }
      return diffCount === 1;
    };
    return bills.some(
      (b) => b.amount === bill.amount && b.date === bill.date && areVendorsSimilar(bill.vendorName, b.vendorName),
    );
  }

  async uploadBills(req: Request): Promise<undefined> {
    // Helper function to convert a buffer to a readable stream
    const bufferToStream = (buffer: Buffer) => {
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null); // Signifies the end of the stream
      return readable;
    };

    // TODO: generate random UUID for each bill
    const bills = await this.billsRepository.findAllAsync();
    const newBills: Bill[] = [];

    // @ts-ignore
    const stream = bufferToStream(req.file.buffer);

    await stream
      .pipe(csv())
      .on("headers", (headers: string[]) => {
        if (!headers.includes("vendorName") || !headers.includes("amount") || !headers.includes("date")) {
          throw Error("Invalid CSV file");
        }
      })
      .on("data", (data: Pick<Bill, "vendorName" | "amount" | "date">) => newBills.push({ id: uuidv4(), ...data })) // Collect each row of CSV data
      .on("end", () => {
        // Dedupe Bills
        newBills.forEach((newBill) => {
          if (!this.isDuplicate(newBill, bills)) {
            bills.push(newBill);
          }
        });
      })
      .on("error", (error: Error) => {
        console.error("Error parsing CSV:", error);
        throw Error("Error parsing CSV file");
      });

    return;
  }
}

export const billsService = new BillsService();
