import { MedusaError } from "@medusajs/utils"
import { isDefined } from "medusa-core-utils"

import { WorkflowArguments } from "../../helper"

type RegionDTO = {
  region_id?: string
}

type HandlerInputData = {
  region: {
    region_id: string
  }
}

enum Aliases {
  Region = "region",
}

export async function attachRegion({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<RegionDTO> {
  let regionId: string
  const regionDTO: RegionDTO = {}
  const regionService = container.resolve("regionService")

  if (isDefined(data[Aliases.Region].region_id)) {
    regionId = data[Aliases.Region].region_id
  } else {
    const regions = await regionService.list({}, {})

    if (!regions?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A region is required to create a cart`
      )
    }

    regionId = regions[0].id
  }

  regionDTO.region_id = regionId

  return regionDTO
}

attachRegion.aliases = Aliases