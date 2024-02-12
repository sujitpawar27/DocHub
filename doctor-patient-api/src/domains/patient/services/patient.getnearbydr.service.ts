import { Service } from "typedi";
import User, { Coordinates } from "../../../common/models/user.model";

@Service()
class UserService {
  async findNearbyUsers(latitude: string, longitude: string): Promise<any> {
    try {
      const userLocation: Coordinates = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      const nearbyUsers = await User.find({
        "address.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [userLocation.longitude, userLocation.latitude],
            },
            $maxDistance: 500000000000000, // in meters
          },
        },
        role: "doctor",
      });

      return { users: nearbyUsers };
    } catch (error) {
      console.error(error);
      throw new Error("Error finding nearby users");
    }
  }
}

export default UserService;
